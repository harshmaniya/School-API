**Role**
  - rolename - admin, faculty, student

**Class**
  - className

**Subject**
  - subjectName
  - subjectCode

**User**
  - First name
  - Lastname
  - Email - unique
  - Gender - male/female
  - Role - Objectid
  - Class - Objectid. — faculty/student
  - Subject - Objectid. — faculty 
  - Enrno - random number.  — student
  - Password - bcrypt password
  - isDeleted - false. // soft delete
  - createdby - Objectid
  - updatedby  - Objectid

**Result**
  - faculty - objectid
  - student - objectid
  - class - objectid
  - score - [{ subject - objectid }, { total - number }, { marksObtain - number }]
  - totalSubjectMarks - number
  - totalObtainMarks - number
  - result - pass/fail
  - grade - distinction/ first class/ second class / pass / fail
  - percentage

**CONDITIONS**

**Result**
  - if student got lt 23 marks in any subject then he will be fail
        
**Grade**
  - result pass and per gte 70 -  distinction
  - result pass and per gte 60 and lt 70 -  first class
  - result pass and per gte 50 and lt 60 -  second class
  - result pass and per lt 50 -  pass
  - result fail - fail



**API**
  - Add default roles, admin if not exists when connect to db
  - Login with email and password
  - **Class** - insert, update, delete, get single, get all - only admin can do this
  - **Subject** - insert, update, delete, get single, get all - only admin can do this
  - **Faculty**- insert, update, delete, get single, get all - only admin can do this
  - **Student** - insert, update, delete, get single, get all - only faculty can do this, student can only view his/her profile
