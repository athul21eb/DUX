# 5-Day Development Schedule - Next.js Fullstack App (NextAuth.js, Prisma, Neon PSQL)




server action demo



'




'use server'

import { ValidationError } from "@/server/core/errors/errors";
import { ErrorResponse, SuccessResponse, TErrorResponse, TSuccessResponse } from "@/utils/serverActionResponses/serverActionResponses"



export const _Server_Action = async():Promise<TSuccessResponse<null>|TErrorResponse>=>{


  try {

    return SuccessResponse('success');
  } catch (error) {
  if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : "failed to"
    );
  }


}


Using proper naming conventions in JavaScript, especially for full-stack app development, improves code readability, maintainability, and scalability. Here are the best practices for naming conventions in a full-stack JavaScript application:

---

### 1. General Naming Rules
- Use camelCase for variables, functions, and object keys (userName, fetchData).
- Use PascalCase for classes and React components (UserModel, ProductCard).
- Use UPPER_CASE_SNAKE_CASE for constants (API_URL, MAX_RETRIES).
- Use kebab-case for file names (user-controller.js, product-card.jsx).
- Keep names descriptive and consistent (fetchUserData, not getInfo).

---

### 2. Frontend Naming Conventions (React & JavaScript)
#### Variables & Functions
const userProfile = { name: "John Doe", age: 30 };
function fetchUserData(userId) { ... }
#### React Components
function UserProfileCard({ user }) { ... }
export default UserProfileCard;
#### State Variables (React)
- Use is or has for boolean values (isLoading, hasError).
- Use set prefix for state setters (setUserData).

const [isLoading, setIsLoading] = useState(false);
const [userData, setUserData] = useState(null);
#### Event Handlers
- Prefix with handle (handleClick, handleSubmit).
function handleFormSubmit(event) { ... }
#### Custom Hooks
- Prefix with use (useAuth, useFetch).
function useAuth() { ... }
---

### 3. Backend Naming Conventions (Node.js, Express, MongoDB)
#### Routes & Controllers
- Use plural nouns for REST API routes (/users, /products).
- Use camelCase for controller functions.
router.get("/users", getAllUsers);
router.post("/users", createUser);
```js
// controllers/userController.js
async function getAllUsers(req, res) { ... }
async function createUser(req, res) { ... }
#### **Models & Schemas (MongoDB/Mongoose)**
- Use **PascalCase** for model names and **camelCase** for schema fields.
js
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
});
const User = mongoose.model("User", UserSchema);
#### **Services & Utilities**
- Use **camelCase** for helper functions and services.
js
// services/authService.js
async function generateToken(user) { ... }

---

### **4. API Naming Conventions**
- Use **RESTful verbs** (`GET /users`, `POST /users`).
- Use **nouns** for resource names (`/orders`, `/products`).
- Use **kebab-case** in URLs (`/user-profile` instead of `/userProfile`).

http
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id

---

### **5. Database Table & Column Naming (SQL)**
- Use **snake_case** for table and column names.
sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VAR6. Constantsl VARCHAR(100)
);

---

### **6. Constants**
- Use `UPPER_CASE_SNAKE_CASE` for constants.
js
const JWT_SECRET = "your_se7. Folder Structure Naming 3;

---

### **7. Folder Structure Naming**
- Use **kebab-case** for folders.
/src
  /components
    product-card.jsx
  /pages
    home.jsx
  /services
    api-service.js
  /controllers
    user-controller.js
`

---

Following these conventions will keep your full-stack JavaScript app structured, readable, and maintainable. Let me know if you need further details!

**Overall Strategy:**

1.  Focus on Core Authentication and User Management First.
2.  Iterative Development: Each day builds on the previous one.
3.  Prioritize Practical Implementation.
4.  Leverage Server Actions.

**Day 1: Authentication Foundation & Basic User Creation**

*   **Goal:** Implement basic authentication with NextAuth.js and allow new user registration with email/password and basic profile information.

*   **Tasks:**

    *   **(9:00 AM - 12:00 PM): NextAuth.js Setup & Google Provider Integration:**
        - [x ] Install necessary NextAuth.js packages (`next-auth`).
        - [x ] Configure NextAuth.js with email/password and Google provider (prioritize email/password first).
        - [ x] Implement basic sign-in and sign-out functionality.
        - [ x] **Google Sign-up: Option to choose new account or existing:**
            - [ x] In `signIn` callback, detect if user with Google email exists.
            - [ x] If exists, sign in.
            - [ x] If not, present choice: "Create new account" or "Sign in with existing".

    *   **(1:00 PM - 5:00 PM): New User Registration (Email/Password):**
        - [ x] Create `/register` page with form (email, password, name).
        - [ x] Implement Server Action to:
            - [ x] Validate input.
            - [ x] Hash password (bcrypt).
            - [x ] Create user in `User` table (Prisma).
            - [ x] Send email verification link.

    *   **(5:00 PM - 7:00 PM): Email Verification Link:**
        - [ x] Generate unique token (uuid or crypto).
        - [ x] Store token and user ID in `VerificationToken` table.
        - [ x] Create "verify email" page (`/verify-email/[token]`).
        - [ x] Implement Server Action to:
            - [x ] Retrieve token from URL.
            - [ x] Query `VerificationToken` table.
            - [x ] If valid, update `emailVerified` to `true` in `User` table.
            - [ x] Delete token from `VerificationToken` table.
            - [ x] Redirect to "verification successful" page.
        - [ x] **Email Sending (Simple):** Use `console.log` initially.

    *   **(7:00 PM - 10:00 PM): Prisma Schema and Basic Data Access Layer:**
        - [ x] Define `User` model in `schema.prisma`.
        - [ x] Create `lib/db.ts`:
            - [x ] `createUser(data: UserData)`
            - [ x] `getUserByEmail(email: string)`
            - [x ] `verifyEmail(token: string)`

**Day 2: User Profile, Authentication Enhancements, and Git Setup**

*   **Goal:** Allow users to view and edit their profile, implement "Forgot Password" functionality, and finalize Git setup.

*   **Tasks:**

    *   **(9:00 AM - 12:00 PM): User Profile (View & Edit):**
        - [ x] Create `/profile` page (protected).
        - [ x] Display user information.
        - [ x]x Create "Edit Profile" form (name, etc.).
        - [ x] Implement Server Action for profile updates.

    *   **(1:00 PM - 4:00 PM): Forgot Password with OTP:**
        - [x ] Create "Forgot Password" page (`/forgot-password`).
        - [x ] Form for email address.
        - [ x] **Server Action:**
            - [ x] Validate email.
            - [ x] Check if email exists.
            - [ x] Generate OTP.
            - [ x] Store OTP and user ID in `OTP` table (with expiry).
            - [ x] Send OTP to email.
        - [x ] Create "Reset Password" page (`/reset-password/[email]`).
        - [ x] Form for OTP and new password.
        - [ x] **Server Action:**
            - [ x] Validate OTP and password.
            - [ x] Verify OTP.
            - [ x] Hash new password.
            - [ x] Update password in `User` table.
            - [x ] Delete OTP.
            - [x ] Redirect to sign-in.

    *   **(4:00 PM - 6:00 PM): Git Setup:**
        - [x ] `git init`
        - [x ] `.gitignore` (exclude `.env`, `node_modules`)
        - [x ] Commit regularly.
        - [x     ] Push to remote repository (GitHub, GitLab, Bitbucket).

    *   **(6:00 PM - 10:00 PM): Data Access Layer Enhancements:**
        - [ x] `updateUser(id: string, data: Partial<UserData>)`
        - [x ] `createOTP(email: string, otp: string)`
        - [ x] `verifyOTP(email: string, otp: string)`
        - [ x] `resetPassword(email: string, hashedPassword: string)`

**Day 3: Role-Based Access Control (RBAC) & Basic Mentor List**

*   **Goal:** Implement basic role-based access control for APIs and create a simple mentor listing.

*   **Tasks:**

    *   **(9:00 AM - 12:00 PM): Role-Based Access Control (RBAC):**
        - [ x] Add `role` field to `User` model (`USER`, `MENTOR`, `ADMIN`).  Default to `USER`.
        - [x ] Middleware/Server Action checks for API access based on role.
        - [x ] Example: `/api/admin/users` (ADMIN only, return 403 otherwise).
        - [x ] Use NextAuth.js session to check role.

    *   **(1:00 PM - 5:00 PM): Mentor List:**
        - [ x] Create `Mentor` model (link to `User` model).
        - [ x] Create `/mentors` page.
        - [ x] Implement Server Action to fetch mentors (filter by `role = MENTOR`).
        - [ x] Display mentor list (name, bio, expertise).

    *   **(5:00 PM - 10:00 PM): Data Access Layer Enhancements:**
        - [x ] `getMentors()`
        - [ x] `createMentorProfile(data: MentorData)`
        - [ x] `getUsersByRole(role: string)`

**Day 4: Mentor Registration & Admin User Management**

*   **Goal:** Allow users to register as mentors (with document upload and OTP verification) and implement basic admin user management (verify/block).

*   **Tasks:**

    *   **(9:00 AM - 1:00 PM): Register as Mentor (with Documents & OTP):**
        - [x ] Create `/register-mentor` page (protected).
        - [ x] Form for:
            - [ x] Document upload (resume, certifications).  **Securely handle file uploads!** (Cloudinary/S3).
            - [ ] OTP entry.
        - [ ] **Server Action:**
            - [ ] Validate form.
            - [ ] Upload documents (Cloudinary/S3).
            - [ ] Generate OTP.
            - [ ] Store OTP in `OTP` table.
            - [ ] Send OTP.
        - [ ] OTP verification step: Update user `role` to `MENTOR` and create `Mentor` record.

    *   **(2:00 PM - 6:00 PM): Admin User Management (Verify/Block):**
        - [ ] Create `/admin/users` page (ADMIN only).
        - [ ] List users with roles and status.
        - [ ] Actions:
            - [ ] "Verify" user (set `emailVerified` to `true`). Send email.
            - [ ] "Block" user (add `blocked` field, set to `true`). Prevent sign-in. Send email.

    *   **(6:00 PM - 10:00 PM): Data Access Layer Enhancements:**
        - [ ] `updateUserRole(id: string, role: string)`
        - [ ] `blockUser(id: string)`
        - [ ] `unblockUser(id: string)`

**Day 5: Skill Management & Polish/Refactor**

*   **Goal:** Implement skill management and refactor code for better readability and maintainability.

*   **Tasks:**

    *   **(9:00 AM - 1:00 PM): Skill Management:**
        - [ ] Create `Skill` model.
        - [ ] Many-to-many relationship between `User` and `Skill`.
        - [ ] Allow users to select skills on profile page.
        - [ ] **Server Actions:**
            - [ ] Fetch skills.
            - [ ] Update user skills.
        - [ ] Display skills on profile.

    *   **(2:00 PM - 6:00 PM): Code Refactoring & Polish:**
        - [ ] Review code.
        - [ ] Extract reusable components.
        - [ ] Improve error handling.
        - [ ] Add logging.
        - [ ] Write unit tests (if time).
        - [ ] Address bugs.

    *   **(6:00 PM - 10:00 PM): Documentation & Deployment:**
        - [ ] Write basic documentation.
        - [ ] Deploy to hosting (Vercel, Netlify).

**Important Considerations:**

*   **Security:**  Prioritize security! Strong passwords, input validation, XSS/CSRF protection.
    - [ ]  Prioritize security! Strong passwords, input validation, XSS/CSRF protection.
*   **Error Handling:** Robust error handling, meaningful error messages.
    - [ ] Robust error handling, meaningful error messages.
*   **Testing:** Unit and integration tests.
     - [ ]  Unit and integration tests.
*   **UI/UX:** User-friendly interface.
      - [ ] User-friendly interface.
*   **Email Service:** Integrate a real email service (SendGrid, Mailgun, etc.).
       - [ ] Integrate a real email service (SendGrid, Mailgun, etc.).
*   **File Uploads:** Securely handle file uploads!
        - [ ] Securely handle file uploads!
*   **Data Validation:** Validate all user input.
        - [ ] Validate all user input.
*   **Rate Limiting:** Protect API endpoints.
         - [ ] Protect API endpoints.
*   **Monitoring:** Track performance and identify issues.
           - [ ] Track performance and identify issues.




           aboutMe
:
"me is good expert  and its very best communication trainer too"
applicationDetails
:
"me is good expert  and its very best communication trainer too"
createdAt
:
"18/02/2025"
documents
:
Array(3)
0
:
"https://res.cloudinary.com/dmrvutjac/image/upload/v1739854128/ghrswjkskx88hqzum1qz.pdf"
1
:
"https://res.cloudinary.com/dmrvutjac/image/upload/v1739854129/wmdrs2enzeh6jxggaozh.pdf"
2
:
"https://res.cloudinary.com/dmrvutjac/image/upload/v1739854131/sirxim0exenpqxluzbzm.pdf"
length
:
3
[[Prototype]]
:
Array(0)
educations
:
Array(1)
0
:
degree
:
"Msc.Computer science"
description
:
"its also good experience to explore the world of degree"
endDate
:
"13/01/2023"
id
:
"e648d1b0-0da0-4be2-9e83-eed9932b10fd"
institution
:
"M G university"
mentorId
:
"0a71ecf9-d582-4791-8ff2-213b973e4f19"
startDate
:
"01/01/2022"
[[Prototype]]
:
Object
length
:
1
[[Prototype]]
:
Array(0)
email
:
"hope.21efootball@gmail.com"
experiences
:
Array(1)
0
:
company
:
"IBM"
description
:
"its really nice experience to work in ibm company."
endDate
:
"01/02/2025"
id
:
"5591ec2f-9d39-4164-b614-a3b14dd81d7c"
mentorId
:
"0a71ecf9-d582-4791-8ff2-213b973e4f19"
role
:
"senior Devleoper"
startDate
:
"10/01/2023"
[[Prototype]]
:
Object
length
:
1
[[Prototype]]
:
Array(0)
id
:
"0a71ecf9-d582-4791-8ff2-213b973e4f19"
image
:
"https://res.cloudinary.com/dmrvutjac/image/upload/v1739854127/trqbitnbuabwn5ll6deu.jpg"
languages
:
Array(1)
0
:
"spanish"
length
:
1
[[Prototype]]
:
Array(0)
mentorName
:
"HOPE"
skills
:
Array(1)
0
:
"communication"
length
:
1
[[Prototype]]
:
Array(0)
updatedAt
:
Tue Feb 18 2025 10:18:51 GMT+0530 (India Standard Time)
[[Prototype]]
:
Object
user
:
createdAt
:
Tue Feb 18 2025 10:13:10 GMT+0530 (India Standard Time) {}
dob
:
null
email
:
"hope.21efootball@gmail.com"
emailVerified
:
null
gender
:
null
id
:
"cm7a00wdw0001rgif2e3fxgt5"
image
:
"https://res.cloudinary.com/dmrvutjac/image/upload/v1739854127/trqbitnbuabwn5ll6deu.jpg"
isBlocked
:
false
name
:
"HOPE"
password
:
null
phone
:
"2563147890"
role
:
"user"
updatedAt
:
Tue Feb 18 2025 10:18:53 GMT+0530 (India Standard Time) {}
[[Prototype]]
:
Object
userId
:
"cm7a00wdw0001rgif2e3fxgt5"
verified
:
false