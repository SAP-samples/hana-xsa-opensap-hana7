@echo "Boostrap HDI Infrastructure"
hdbsql -u SYSTEM -n hanapm.local.com:30015 -i 00 -p %1 -A -m -j  -V %1 "\i bootstrap.sql"  