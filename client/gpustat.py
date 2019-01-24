#!/usr/bin/env python3

import sh
import re
import os
from pymongo import MongoClient
import time
from rcfile import rcfile
import logging
import functools


config = rcfile('gpustat')

mongo_user, mongo_pw, mongo_host, mongo_port, gpustat_machine = [config.get(k, d) for k, d in (('mongo_user', ''), ('mongo_pw', ''), ('mongo_host', 'localhost'), ('mongo_port', '27017'), ('machine_name', ''))]

nvsmi = sh.Command('nvidia-smi')
percre = re.compile('\\d+%')

def get_nvidia_stats():
    ctext = nvsmi()
    _, pblock, ublock = ctext.split('|==')
    pblock = pblock.split('\n')[2::3]
    percs = [percre.findall(pb)[-1] for pb in pblock if pb.startswith('|')]
    percs = [int(p[:-1]) for p in percs]
    ublock = ublock.split('+--')[0].split('\n')[1:-1]
    pids = [u.split()[1:3] for u in ublock if not ('No running' in u)]
    gids, pids = zip(*pids) if len(pids) > 0 else ([], [])

    uids = [sh.ps('u', pid).split('\n')[1].split()[0] for pid in pids]

    free_gpus = list(set(range(len(percs))) - set(range(len(uids))))

    entries = []
    for gid, pid, uid in zip(gids, pids, uids):
        perc = percs[int(gid)]
        entries.append(dict(gid=gid, pid=pid, uid=uid, perc=perc))

    return free_gpus, entries


def get_top_stats():
    ctext = sh.top('-b', '-n1').split('\n')
    lavg = float(ctext[0].split('load average:')[1].strip().split()[0][:-1])
    mem_line = ctext[3].split(':')[1].split('used')[0].strip()
    mem_total = int(mem_line.split('+')[0])
    mem_used = int(mem_line.split()[-1])
    ctext = ctext[7:]
    procs = []
    for line in ctext:
        line = [t for t in line.split() if len(t)]
        if len(line) != 12:
            continue
        uid, cpu, mem, cmd = line[1], float(line[8]), float(line[9]), line[11]
        if cpu < 50 and mem < 5:
            continue
        procs.append(dict(uid=uid, cpu=cpu, mem=mem, cmd=cmd))
    return lavg, mem_total, mem_used, procs



with MongoClient(host=mongo_host, port=int(mongo_port)) as mongo_client:
    db = mongo_client['gpustat']
    if mongo_user:
        db.authenticate(mongo_user, mongo_pw, source='admin')
    
    while(True):
        try:
            timestamp = time.time()
            free_gpus, entries = get_nvidia_stats()
            db.gpu.insert({'timestamp': timestamp, 'machine': gpustat_machine, 'totalfree': len(free_gpus), 'whichfree': free_gpus, 'details': entries})
            lavg, mem_total, mem_used, procs = get_top_stats()
            db.cpu.insert({'timestamp': timestamp, 'machine': gpustat_machine, 'load_avg': lavg, 'mem_total': mem_total, 'mem_used': mem_used, 'procs': procs})

        except Exception as e:
            raise
            logging.warn(e)
        break
        time.sleep(60)
