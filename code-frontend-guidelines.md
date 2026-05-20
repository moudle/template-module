# React Frontend Development Guidelines

This document provides strict structural and design instructions for implementing React pages and components within feature modules. These rules ensure that all modular interfaces remain strictly typed, safe, highly functional, and extremely premium in terms of UX.

---

## 1. Strict Typing for Variables and Functions

Every line of code on a page must utilize explicit TypeScript typing. Auto-inference is fine for simple local primitives, but **all function signatures, component props, state hooks, and complex data structures must be explicitly and strictly typed.** The usage of the `any` type is strictly forbidden in final files.

### Guidelines
- **Props**: Define clear interface contracts for all props (prefixed with `I` where appropriate).
- **State Hooks**: Explicitly parameterize `useState<T>()` for objects, arrays, and nullable states.
- **Function Arguments & Returns**: Type all arguments and return values. For React components, use `React.JSX.Element` or React function types.
- **Event Handlers**: Type interaction events explicitly (e.g., `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent`).

### Example
```tsx
import React, { useState } from 'react';

interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface IUserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
}

export function UserTable({ users, onEdit }: IUserTableProps): React.JSX.Element {
  const [filterQuery, setFilterQuery] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFilterQuery(event.target.value);
  };

  return (
    <div>
      <input 
        type="text" 
        className="input input-bordered w-full max-w-xs" 
        value={filterQuery} 
        onChange={handleInputChange} 
      />
      {/* Table implementation */}
    </div>
  );
}
```

---

## 2. Modal-Based Create and Edit Workflows

To maintain a clean user journey, **all creation and editing operations on CRUD pages must be performed inside modals/popups.** Do not use inline input lists or route to separate sub-pages for form submission.

### Guidelines
- Use daisyUI `modal` components to house forms. Add a backdrop blur overlay (`bg-base-950/40 backdrop-blur-sm z-50`) to keep the focus tight.
- Control the open/close state of modals using React state (e.g., `isCreateOpen: boolean` or `editingItem: T | null`).
- Reset form inputs automatically when the modal collapses or closes.

### Example
```tsx
// Using daisyUI modal structure controlled via state
{isEditModalOpen && (
  <div className="modal modal-open bg-base-950/40 backdrop-blur-sm z-50">
    <div className="modal-box border border-base-300 shadow-2xl bg-base-100">
      <h3 className="font-bold text-lg">Edit Record</h3>
      <div className="py-4 gap-4 flex flex-col">
        <input 
          type="text" 
          className="input input-bordered" 
          value={editName} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)} 
        />
      </div>
      <div className="modal-action">
        <button className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  </div>
)}
```

---

## 3. Comprehensive Tables with Summary Cards

CRUD lists must present data exhaustively to ensure high scannability, combined with overview metrics positioned directly above the tables.

### Guidelines
- **Show as Much Data as Possible**: Display all fields useful to administrative or dashboard users (e.g., creation dates, statuses, roles, item lists).
- **Summary Header**: Display a `stats` or metadata summary block above the primary table. This should present cumulative metrics like total count, active/inactive statuses, or average aggregates to help the user understand the table context at a glance. Use daisyUI `stats shadow border border-base-300 w-full` styling.
- **Mandatory Row Actions**: Every CRUD table must have at least **edit** and **delete** action buttons on each row (e.g., triggering edit modals and delete confirmation flows). Place action buttons inside a `text-right` aligned column utilizing lightweight ghost buttons (`btn-ghost btn-xs text-primary` / `text-error`) for a premium layout.

### Example
```tsx
{/* 1. Summary Cards on top of the Table */}
<div className="stats shadow border border-base-300 w-full mb-6">
  <div className="stat">
    <div className="stat-title">Total Records</div>
    <div className="stat-value text-primary">{items.length}</div>
    <div className="stat-desc">Synchronized with main database</div>
  </div>
  <div className="stat">
    <div className="stat-title">Active Items</div>
    <div className="stat-value text-success">{activeCount}</div>
  </div>
</div>

{/* 2. Comprehensive Table with all details */}
<div className="overflow-x-auto border border-base-300 rounded-lg shadow">
  <table className="table table-zebra w-full">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Created Date</th>
        <th>Status</th>
        <th className="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.title}</td>
          <td>{new Date(item.createdAt).toLocaleDateString()}</td>
          <td><span className="badge badge-success">{item.status}</span></td>
          <td className="text-right">
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost btn-xs text-primary font-bold" onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn btn-ghost btn-xs text-error font-semibold" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 4. Searchable Autocomplete Combobox Selectors

When creating or modifying relational items, **avoid basic raw select boxes for searchable entities.** Implement a premium searchable autocompleting combobox that supports keyboard queries, lists filtered database items, and exposes options to create new records on-the-fly.

### Guidelines
- **Autocomplete State**: Store the text search query in local React state and use it to filter matching options in real-time.
- **Dynamic Popup Menu**: Position absolute autocomplete options list (`absolute z-50 left-0 right-0 mt-1.5 shadow-xl max-h-40 overflow-y-auto bg-base-300 rounded-box`) directly under the input field.
- **Click Outside Listener**: Always implement an explicit click outside wrapper using React `useRef` to safely collapse autocomplete menus when the user focuses elsewhere.
- **Inline Append Option**: If a typed term does not match any database items, expose a primary inline "Add new..." option to dynamically generate a new entity.

### Example
```tsx
import React, { useState, useEffect, useRef } from 'react';

export function SearchableCombobox(): React.JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<string[]>(['Dashboard', 'Billing', 'Analytics']);
  
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filtered = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  const showCreateOption = query.trim() !== '' && !items.some(item => item.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="relative" ref={containerRef}>
      <input 
        className="input input-bordered w-full"
        placeholder="Type or search..."
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (query.trim() !== '' || filtered.length > 0) && (
        <ul className="menu bg-base-300 absolute z-50 left-0 right-0 mt-1 rounded-box shadow-lg max-h-40 overflow-y-auto">
          {filtered.map(item => (
            <li key={item}>
              <a onClick={() => { setQuery(item); setIsOpen(false); }}>{item}</a>
            </li>
          ))}
          {showCreateOption && (
            <li className="border-t border-base-content/10">
              <a onClick={() => { setItems([...items, query]); setIsOpen(false); }}>
                ✨ Add new: "{query}"
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
```

---

## 5. Mandatory Popup Confirmations for Writes/Updates

To protect users against accidental mutations, **every write operation (creation, deletion, or modification) must require a visual confirmation popup before sending requests to the backend API.**

### Guidelines
- Prompt the user with a browser confirmation window (`window.confirm`) or a styled modal component.
- The action should only proceed if the user explicitly approves.

### Example
```tsx
const handleSave = async (): Promise<void> => {
  const confirmed = window.confirm("Are you absolutely sure you want to commit these changes?");
  if (!confirmed) return;

  try {
    // Proceed with API write request
    await axios.post('/api/item', formData);
    fetchData();
  } catch (err) {
    console.error("Mutation failed", err);
  }
};
```

---

## 6. Table Pagination & Limit Selectors

Every CRUD table containing database records must implement active page navigation and page limits (e.g., 10, 20, 50, 100 items per page) to prevent slow network responses and high client-side CPU usage.

### Guidelines
- Maintain states for current page index (`page: number`) and current page size limit (`limit: number`).
- Render pagination links using daisyUI `join` buttons.
- Render a drop-down selector representing limits (`10`, `20`, `50`, `100`) allowing real-time adjustment.

### Example
```tsx
export function PaginatedList(): React.JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col gap-4">
      {/* Table goes here */}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-base-300">
        
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-base-content/60">Show:</span>
          <select 
            className="select select-bordered select-xs" 
            value={limit} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setLimit(parseInt(e.target.value));
              setPage(1); // Reset to page 1 on limit change
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Page Navigation Links */}
        <div className="join">
          <button 
            className="join-item btn btn-xs" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            «
          </button>
          <button className="join-item btn btn-xs btn-active">
            Page {page} of {totalPages}
          </button>
          <button 
            className="join-item btn btn-xs" 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
          >
            »
          </button>
        </div>
        
      </div>
    </div>
  );
}
```

---

## 7. Mandatory UI Layout Wrapper Compliance

To ensure seamless integration into the host/master project kernel, **every module page implementation inside `ui.tsx` MUST be wrapped by the dynamic layout wrapper template provided by the `config-ui` file.**

### Guidelines
- In `ui.tsx`, extract the dynamic `LayoutWrapper` component from your module's `CONFIG_UI_*` config.
- By default, this layout acts as a transparent `<div {...props} />` container, but the host application overrides it at runtime to inject standard main shell layout navigation and styling.
- All router page views must return `<Wrapper><YourPage /></Wrapper>` elements instead of direct page containers.

### Example in `ui.tsx`
```tsx
import React from 'react';
import { redirect } from 'react-router-dom';
import { CONFIG_UI_USER_ROLE } from './config-ui';
import { UserManagementPage } from './page/UserManagementPage';
import { getToken } from './ui';

export const LIST_PAGE_USER_ROLE = {
  '/management/user': {
    async loader() {
      const token = getToken();
      if (!token) return redirect('/login');
      return {};
    },
    Component(): React.JSX.Element {
      const Wrapper = CONFIG_UI_USER_ROLE.LayoutWrapper;
      return <Wrapper><UserManagementPage /></Wrapper>;
    }
  }
};
```

---

## 8. Component Placement & Dead Code Cleanup

To maintain a clean and structured codebase, all UI components must follow strict organization rules.

### Guidelines
- **UI Components Location**: All shared or sub-components (buttons, form inputs, badges, select boxes, etc.) must be implemented under the `module/page/components/` directory. Only main page views/controllers should reside in the root of `module/page/`.
- **Unused Component Cleanup**: To prevent codebase rot and maintain an optimized bundle, developers can and should delete any component inside `module/page/components/` if it is no longer used by any pages or other components. Do not leave dead/orphaned UI code in the repository.



