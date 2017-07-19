#!/bin/sh

source ENV.sh

/usr/local/bin/etcd \
  --data-dir=/etcd-data --name ${THIS_NAME} \
  --initial-advertise-peer-urls http://${THIS_IP}:2380 \
  --listen-peer-urls http://${LISTEN_IP}:2380 \
  --advertise-client-urls http://${THIS_IP}:2379 \
  --listen-client-urls http://${LISTEN_IP}:2379 \
  --initial-cluster ${CLUSTER} \
  --initial-cluster-state ${CLUSTER_STATE} \
  --initial-cluster-token ${TOKEN}
