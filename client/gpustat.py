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

def get_stats():
    ctext = nvsmi()
    _, pblock, ublock = ctext.split('|==')
    pblock = pblock.split('\n')[2::3]
    percs = [percre.findall(pb)[1] for pb in pblock if pb.startswith('|')]
    percs = [int(p[:-1]) for p in percs]
    ublock = ublock.split('+--')[0].split('\n')[1:-1]
    pids = [u.split()[1:3] for u in ublock if not ('No running' in u)]
    gids, pids = zip(*pids) if len(pids) > 0 else ([], [])

    uids = [sh.ps('u', pid).split('\n')[1].split()[0] for pid in pids]

    free_gpus = list(set(range(len(percs))) - set(range(len(uids))))

    ustats = dict()
    entries = []
    for gid, pid, uid in zip(gids, pids, uids):
        perc = percs[int(gid)]
        entries.append(dict(gid=gid, pid=pid, uid=uid, perc=perc))
        ulist = ustats.get(uid, None) or []
        ulist.append(perc)
        ustats[uid] = ulist

    return free_gpus, entries, ustats


with MongoClient(host=mongo_host, port=int(mongo_port)) as mongo_client:
    db = mongo_client['gpustat']
    if mongo_user:
        db.authenticate(mongo_user, mongo_pw, source='admin')
    
    while(True):
        try:
            free_gpus, entries, ustats = get_stats()
            timestamp = time.time()
            db.freebusy.insert({'timestamp': timestamp, 'machine': gpustat_machine, 'totalfree': len(free_gpus), 'whichfree': free_gpus, 'details': entries})
            for uid, percs in ustats.items():
                meanp = functools.reduce(lambda x, y: x+y, percs, 0.) / (len(percs) or 1)
                db.usage.insert({'user': uid, 'timestamp': timestamp, 'machine': gpustat_machine, 'totalused': len(percs), 'meanperc': meanp})

        except Exception as e:
            logging.warn(e)
        time.sleep(60)
