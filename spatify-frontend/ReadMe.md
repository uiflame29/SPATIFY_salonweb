Test Accounts
Role	Full Name	Email Address	Password
Admin	Alexandra Chen	admin@spatify.com	Alex@Spatify2026
Admin	Admin Spatify	admin@spatify.ph	Admin@123456!
Manager	Michael Torres	manager@spatify.com	Mich@Spatify2026
Manager	Manager Spatify	manager@spatify.ph	Manager@123456!
Staff	Maria Santos	maria@spatify.ph	Maria@Spatify123!
Staff	Sophia Reyes	staff1@spatify.com	Mari@Spatify2026
Staff	John Dela Cruz	staff2@spatify.com	John@Spatify2026
Staff	Rosa Garcia	staff@spatify.com	Rosa@Spatify2026
Customer	Anna D.	anna@example.com	Anna@Password123!
Customer	Isabella Luna	customer@spatify.com	Cust@Spatify2026
Customer	Carlos M.	carlos@example.com	Carl@Spatify2026
Customer	Elena F.	elena@example.com	Elen@Spatify2026

To run this site visit:
http://localhost:8126

$env:PGPASSWORD='postgres'; psql -U postgres -d spatify_db -c "\dt"