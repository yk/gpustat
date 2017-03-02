From nvidia/cuda:8.0-runtime
MAINTAINER Yannic Kilcher
ADD gpustat.py /home/gpustat/gpustat.py
WORKDIR /home/gpustat
RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/* && pip3 install rcfile pymongo sh
CMD ["python3", "gpustat.py"]
