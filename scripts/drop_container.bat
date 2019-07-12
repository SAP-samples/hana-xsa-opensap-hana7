@echo "Drop Container"
hdbsql -u HDI_ADMIN -n hanapm.local.com:30015 -i 00 -p %1 -A -m -j  -V %1,%2 "\i drop_container.sql"