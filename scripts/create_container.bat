@echo "Create Container"
hdbsql -u HDI_ADMIN -n hanapm.local.com:30015 -i 00 -p %1 -A -m -j  -V %1,%2 "\i create_container.sql"