#!/bin/bash
#set -euo pipefail

: "${DB_HOST:?DB_HOST is required}"
: "${DB_PORT:?DB_PORT is required}"
: "${DB_NAME:?DB_NAME is required}"
: "${DB_USER:?DB_USER is required}"
: "${DB_PASSWORD:?DB_PASSWORD is required}"

ASADMIN="${PAYARA_DIR}/bin/asadmin --user=${ADMIN_USER} --passwordfile=${PASSWORD_FILE} --interactive=false"

cleanup() {
    ${ASADMIN} stop-domain "${DOMAIN_NAME}" >/dev/null 2>&1 || true
}

trap cleanup EXIT

echo "[ProjectTracker] Preparing Payara JDBC resources"

${ASADMIN} start-domain "${DOMAIN_NAME}"

if ! ${ASADMIN} list-jdbc-connection-pools | grep -Fxq "ProjectTrackerPool"; then
    ${ASADMIN} create-jdbc-connection-pool \
        --datasourceclassname com.mysql.cj.jdbc.MysqlDataSource \
        --restype javax.sql.DataSource \
        --property "serverName=${DB_HOST}:portNumber=${DB_PORT}:databaseName=${DB_NAME}:user=${DB_USER}:password=${DB_PASSWORD}:useSSL=false:allowPublicKeyRetrieval=true" \
        ProjectTrackerPool
fi

if ! ${ASADMIN} list-jdbc-resources | grep -Fxq "jdbc/projectTracker"; then
    ${ASADMIN} create-jdbc-resource \
        --connectionpoolid ProjectTrackerPool \
        jdbc/projectTracker
fi

${ASADMIN} stop-domain "${DOMAIN_NAME}"
trap - EXIT

echo "[ProjectTracker] Payara JDBC resources are ready"
