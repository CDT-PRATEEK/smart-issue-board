# Smart Issue Board 📌

A React-based issue tracking application built for the Apnibus internship assessment. This application allows users to create, manage, and filter issues with real-time updates and smart duplicate detection.

**Live Demo:** [https://smart-issue-board-rust.vercel.app/](https://smart-issue-board-rust.vercel.app/)

---

## 📖 Questions & Design Decisions

### 1. Why did you choose the frontend stack you used?
I chose **React with Vite** for the frontend:
* **React:** It allows for a component-based architecture (e.g., reusable `IssueCard` components) and handles state management efficiently, which is crucial for real-time updates.
* **Vite:** It offers significantly faster build times and hot module replacement compared to Create React App, allowing for rapid development within the short submission timeframe.
* **CSS Modules (Custom):** Instead of relying on heavy UI libraries like Bootstrap or Tailwind, I used standard CSS and Flexbox to demonstrate a solid grasp of fundamental layout concepts without over-engineering.

### 2. Explain your Firestore data structure
To keep the architecture flat and efficient for this MVP, I used a single collection named `issues`.

**Document Structure:**
* `id` (Auto-generated): Unique identifier.
* `title` (String): The issue headline.
* `desc` (String): Detailed description.
* `priority` (String): 'Low' | 'Medium' | 'High'.
* `status` (String): 'Open' | 'InProgress' | 'Done'.
* `assignedTo` (String): Email of the user responsible for the task.
* `createdBy` (String): Email of the creator (for audit purposes).
* `createdAt` (ISO String): Timestamp used for sorting (Newest First).

### 3. Explain how you handled similar issues
I implemented a client-side "Smart Check" before creation to prevent clutter:
1.  When the user clicks "Add Issue", the app scans the locally cached `issues` state.
2.  It uses `.find()` to check if any existing issue title includes the new title (case-insensitive substring match).
3.  If a match is found, a `window.confirm()` dialog interrupts the process, warning the user: *"Found a similar issue: [Title]. Create anyway?"*
4.  The user can then choose to Cancel (preventing duplication) or Proceed.

### 4. Mention what was confusing or challenging
The most challenging part was handling the **Status Transition Rules** while keeping the UI responsive.
* **Challenge:** Ensuring that a user cannot jump directly from 'Open' to 'Done'.
* **Solution:** I added a validation check in the `updateStatus` function. If an invalid move is attempted, the app prevents the database update and displays an error Toast to the user explaining the rule.

### 5. Mention what you would improve next
If I had more time, I would implement:
1.  **Kanban Board (Drag-and-Drop):** Using `react-beautiful-dnd` to allow users to move cards between columns visually.
2.  **User Dropdown:** Instead of manually typing email addresses for assignments, I would fetch a list of registered users from a `users` collection to populate a select dropdown.
3.  **Comments System:** Adding a sub-collection for comments on each issue to enable team discussion.

---

## 🛠️ Setup & Installation

If you want to run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/CDT-PRATEEK/smart-issue-board.git](https://github.com/CDT-PRATEEK/smart-issue-board.git)
    cd smart-issue-board
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_API_KEY=your_api_key
    VITE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_PROJECT_ID=your_project_id
    VITE_STORAGE_BUCKET=your_project.appspot.com
    VITE_MESSAGING_SENDER_ID=your_sender_id
    VITE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```