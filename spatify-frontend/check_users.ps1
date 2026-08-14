$env:PGPASSWORD = "postgres"
psql -U postgres -d spatify_db -c "SELECT email, role FROM users;"
Remove-Item Env:PGPASSWORD
