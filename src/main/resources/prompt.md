Fix the syntax error in frontend/App.jsx line 76.

Step 1 — Read the file:
cat frontend/App.jsx

Step 2 — The error shows line 76 contains a broken JSX tag ending with:
oleGuard>} />

This means a component name got cut off. It is likely one of:
RoleGuard, ConsoleGuard, PrivateRoute, ProtectedRoute, or similar.

Step 3 — Look at lines 70-85 to understand the context:
The broken line probably looks like one of these:
element={<SomeComp ... /><RoleGuard>} />          ← JSX inside wrong place
} element={<RoleGuard>} />                         ← unclosed tag
element={<PrivateRoute><RoleGuard>} />             ← missing closing

Step 4 — Fix the broken line so it is valid JSX.
Common correct patterns for protected routes in React Router v6:
<Route path="/home" element={<PrivateRoute><ClientHome /></PrivateRoute>} />
<Route path="/home" element={<RoleGuard role="CLIENT"><ClientHome /></RoleGuard>} />

After fixing line 76, check lines 70-90 for any other unclosed or broken tags.

Step 5 — Run npm run dev and confirm zero parse errors.
If new errors appear, fix them with the same approach — read the file, find the broken line, fix the JSX syntax.

STOP when: vite starts with "VITE ready" and no [PARSE_ERROR] messages appear.