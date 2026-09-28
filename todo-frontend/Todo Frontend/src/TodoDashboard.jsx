
import { useEffect, useState } from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

import {
    LayoutDashboard,
    ListTodo,
    CircleCheck,
    Clock3,
    CalendarDays,
    Bell,
    Mail
} from "lucide-react";

import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
} from "./services/taskService";

import {
    initializeNotifications,
    showTaskNotification
} from "./services/notificationService";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";


function TodoDashboard() {

    const [tasks, setTasks] = useState([]);
    const [displayTasks, setDisplayTasks] = useState([]);

    const [activeMenu, setActiveMenu] =
        useState("Dashboard");

    const [selectedDate, setSelectedDate] =
        useState("");

    const [notificationsRead, setNotificationsRead] =
        useState(false);

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });


    /* =========================================
       LOAD TASKS
    ========================================= */

    const loadTasks = async () => {

        try {

            const data = await getAllTasks();

            setTasks(data);
            setDisplayTasks(data);

            // 🔔 NOTIFICATION — ONLY ADDITION
            checkTaskNotifications(data);

        } catch (error) {

            console.error(
                "Error loading tasks:",
                error
            );

        }
    };


    // 🔔 NOTIFICATION — ONLY ADDITION
    const checkTaskNotifications = async (taskList) => {

        if (!taskList || taskList.length === 0) {
            return;
        }

        if (
            !("Notification" in window) ||
            Notification.permission !== "granted"
        ) {
            return;
        }

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        for (const task of taskList) {

            if (
                task.completed ||
                !task.dueDate
            ) {
                continue;
            }


            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(
                0,
                0,
                0,
                0
            );


            if (
                dueDate.getTime() ===
                today.getTime()
            ) {

                await showTaskNotification(
                    "📅 TaskFlow - Due Today",
                    `"${task.title}" is due today.`
                );

            } else if (
                dueDate.getTime() ===
                tomorrow.getTime()
            ) {

                await showTaskNotification(
                    "🔔 TaskFlow - Due Tomorrow",
                    `"${task.title}" is due tomorrow.`
                );

            } else if (
                dueDate < today
            ) {

                await showTaskNotification(
                    "⚠️ TaskFlow - Overdue Task",
                    `"${task.title}" is overdue.`
                );
            }
        }
    };


    // 🔔 NOTIFICATION — ONLY ADDITION
    useEffect(() => {

        initializeNotifications();

    }, []);


    useEffect(() => {

        loadTasks();

        const interval = setInterval(() => {
            loadTasks();
        }, 30000);

        return () =>
            clearInterval(interval);

    }, []);


    /* =========================================
       ADD TASK
    ========================================= */

    const handleAddTask = async (task) => {

        try {

            await createTask(task);

            await loadTasks();

        } catch (error) {

            console.error(
                "Error creating task:",
                error
            );

        }
    };


    /* =========================================
       UPDATE TASK
    ========================================= */

    const handleUpdateTask = async (
        id,
        task
    ) => {

        try {

            await updateTask(
                id,
                task
            );

            await loadTasks();

        } catch (error) {

            console.error(
                "Error updating task:",
                error
            );

        }
    };


    /* =========================================
       DELETE TASK
    ========================================= */

    const handleDeleteTask = async (id) => {

        try {

            await deleteTask(id);

            await loadTasks();

        } catch (error) {

            console.error(
                "Error deleting task:",
                error
            );

        }
    };


    /* =========================================
       SEARCH
    ========================================= */

    const handleSearch = (searchText) => {

        const text =
            searchText
                .trim()
                .toLowerCase();

        if (text === "") {

            setDisplayTasks(tasks);

            return;
        }

        const filteredTasks =
            tasks.filter((task) =>
                task.title
                    ?.toLowerCase()
                    .includes(text)
            );

        setDisplayTasks(filteredTasks);
    };


    /* =========================================
       TASK COUNTS
    ========================================= */

    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            (task) =>
                task.completed
        ).length;

    const pendingTasks =
        tasks.filter(
            (task) =>
                !task.completed
        ).length;


    /* =========================================
       PERCENTAGES
    ========================================= */

    const completedPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks /
                    totalTasks) *
                100
            );

    const pendingPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (pendingTasks /
                    totalTasks) *
                100
            );


    /* =========================================
       STATUS CHART
    ========================================= */

    const statusData = [

        {
            name: "Completed",
            value: completedTasks
        },

        {
            name: "Pending",
            value: pendingTasks
        }

    ];


    /* =========================================
       PRIORITY CHART
    ========================================= */

    const priorityData = [

        {
            name: "High",
            count: tasks.filter(
                (task) =>
                    task.priority === "HIGH"
            ).length
        },

        {
            name: "Medium",
            count: tasks.filter(
                (task) =>
                    task.priority === "MEDIUM"
            ).length
        },

        {
            name: "Low",
            count: tasks.filter(
                (task) =>
                    task.priority === "LOW"
            ).length
        }

    ];


    /* =========================================
       CHART COLORS
    ========================================= */

    const STATUS_COLORS = [
        "#22c55e",
        "#f59e0b"
    ];

    const PRIORITY_COLORS = [
        "#ef4444",
        "#f59e0b",
        "#22c55e"
    ];


    /* =========================================
       DATE CALCULATIONS
    ========================================= */

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    /* =========================================
       OVERDUE TASKS
    ========================================= */

    const overdueTasks =
        tasks.filter((task) => {

            if (
                !task.dueDate ||
                task.completed
            ) {
                return false;
            }

            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(
                0,
                0,
                0,
                0
            );

            return dueDate < today;

        });


    /* =========================================
       TODAY TASKS
    ========================================= */

    const todayTasks =
        tasks.filter((task) => {

            if (
                !task.dueDate ||
                task.completed
            ) {
                return false;
            }

            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(
                0,
                0,
                0,
                0
            );

            return (
                dueDate.getTime() ===
                today.getTime()
            );

        });


    /* =========================================
       TOMORROW TASKS
    ========================================= */

    const tomorrowTasks =
        tasks.filter((task) => {

            if (
                !task.dueDate ||
                task.completed
            ) {
                return false;
            }

            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(
                0,
                0,
                0,
                0
            );

            return (
                dueDate.getTime() ===
                tomorrow.getTime()
            );

        });


    const notificationCount =
        overdueTasks.length +
        todayTasks.length +
        tomorrowTasks.length;


    /* =========================================
       SIDEBAR MENU
    ========================================= */

    const handleMenuClick =
        (menu) => {

            setActiveMenu(menu);

            if (
                menu === "Dashboard" ||
                menu === "All Tasks"
            ) {

                setDisplayTasks(
                    tasks
                );

            }

            else if (
                menu === "Completed"
            ) {

                setDisplayTasks(
                    tasks.filter(
                        (task) =>
                            task.completed
                    )
                );

            }

            else if (
                menu === "Pending"
            ) {

                setDisplayTasks(
                    tasks.filter(
                        (task) =>
                            !task.completed
                    )
                );

            }

            else if (
                menu === "Calendar"
            ) {

                setDisplayTasks([]);

            }

            else if (
                menu === "Notifications"
            ) {

                setNotificationsRead(
                    true
                );

                setDisplayTasks([
                    ...overdueTasks,
                    ...todayTasks,
                    ...tomorrowTasks
                ]);

            }

        };


    /* =========================================
       PROFILE
    ========================================= */

    const handleProfileClick = () => {

        setActiveMenu("Profile");

        setDisplayTasks([]);

        const savedUser =
            localStorage.getItem("user");

        if (savedUser) {

            setUser(
                JSON.parse(savedUser)
            );

        }

    };


    /* =========================================
       LOGOUT
       NEW ONLY
    ========================================= */

    const handleLogout = () => {

        localStorage.removeItem("user");

        window.location.href = "/";

    };


    /* =========================================
       NOTIFICATION CLICK
    ========================================= */

    const handleNotificationClick =
        (task) => {

            setActiveMenu(
                "Notifications"
            );

            setDisplayTasks([
                task
            ]);

        };


    /* =========================================
       CALENDAR
    ========================================= */

    const handleDateChange =
        (date) => {

            setSelectedDate(date);

            if (!date) {

                setDisplayTasks(
                    tasks
                );

                return;
            }

            const filteredTasks =
                tasks.filter(
                    (task) =>
                        task.dueDate ===
                        date
                );

            setDisplayTasks(
                filteredTasks
            );

        };


    return (

        <div className="dashboard">


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="sidebar">


                <div className="sidebar-logo">

                    <h2>
                        TaskFlow
                    </h2>

                    <p>
                        Todo List Management
                    </p>

                </div>


                <nav className="sidebar-menu">


                    <button
                        className={
                            activeMenu ===
                            "Dashboard"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick(
                                "Dashboard"
                            )
                        }
                    >

                        <span className="sidebar-label">

                            <LayoutDashboard
                                size={18}
                            />

                            <span>
                                Dashboard
                            </span>

                        </span>

                    </button>


                    <button
                        className={
                            activeMenu ===
                            "All Tasks"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick(
                                "All Tasks"
                            )
                        }
                    >

                        <span className="sidebar-label">

                            <ListTodo
                                size={18}
                            />

                            <span>
                                All Tasks
                            </span>

                        </span>


                        <span className="sidebar-count">
                            {totalTasks}
                        </span>

                    </button>


                    <button
                        className={
                            activeMenu ===
                            "Completed"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick(
                                "Completed"
                            )
                        }
                    >

                        <span className="sidebar-label">

                            <CircleCheck
                                size={18}
                            />

                            <span>
                                Completed
                            </span>

                        </span>


                        <span className="sidebar-count">
                            {completedTasks}
                        </span>

                    </button>


                    <button
                        className={
                            activeMenu ===
                            "Pending"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick(
                                "Pending"
                            )
                        }
                    >

                        <span className="sidebar-label">

                            <Clock3
                                size={18}
                            />

                            <span>
                                Pending
                            </span>

                        </span>


                        <span className="sidebar-count">
                            {pendingTasks}
                        </span>

                    </button>


                    <button
                        className={
                            activeMenu ===
                            "Calendar"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick(
                                "Calendar"
                            )
                        }
                    >

                        <span className="sidebar-label">

                            <CalendarDays
                                size={18}
                            />

                            <span>
                                Calendar
                            </span>

                        </span>

                    </button>


                    <button
                        className={
                            activeMenu ===
                            "Notifications"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick(
                                "Notifications"
                            )
                        }
                    >

                        <span className="sidebar-label">

                            <Bell
                                size={18}
                            />

                            <span>
                                Notifications
                            </span>

                        </span>


                        {notificationCount > 0 &&
                            !notificationsRead && (

                                <span className="notification-badge">

                                    {notificationCount}

                                </span>

                            )}

                    </button>

                </nav>


                {/* =========================================
                    PROFILE BUTTON
                ========================================= */}

                <button
                    className={
                        activeMenu === "Profile"
                            ? "profile-button profile-button-active"
                            : "profile-button"
                    }
                    onClick={
                        handleProfileClick
                    }
                >

                    <span className="profile-avatar">

                        {user?.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}

                    </span>

                    <span>
                        {user?.name || "Profile"}
                    </span>

                </button>


                {/* =========================================
                    LOGOUT BUTTON — NEW ONLY
                ========================================= */}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="main-content">


                {/* =========================================
                    HEADER
                ========================================= */}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            {activeMenu === "Profile"
                                ? "My Profile"
                                : "Todo Dashboard"}
                        </h1>

                        <p>
                            {activeMenu === "Profile"
                                ? "View your account details"
                                : "Manage your tasks easily"}
                        </p>

                    </div>

                </header>


                {/* =========================================
                    PROFILE SECTION
                ========================================= */}

                {activeMenu === "Profile" && (

                    <section className="profile-section">

                        <div className="profile-header">

                            <div className="profile-icon">

                                <span className="profile-avatar">

                                    {user?.name
                                        ? user.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}

                                </span>

                            </div>

                            <div>

                                <h2>
                                    {user?.name || "User Details"}
                                </h2>

                                <p>
                                    Your account information
                                </p>

                            </div>

                        </div>


                        <div className="profile-details">


                            <div className="profile-detail">

                                <div className="profile-detail-icon">

                                    <span className="profile-avatar">

                                        {user?.name
                                            ? user.name
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}

                                    </span>

                                </div>

                                <div className="profile-detail-content">

                                    <span className="profile-detail-label">
                                        Name
                                    </span>

                                    <span className="profile-detail-value">

                                        {user?.name ||
                                            "Name not available"}

                                    </span>

                                </div>

                            </div>


                            <div className="profile-detail">

                                <div className="profile-detail-icon">

                                    <Mail
                                        size={18}
                                    />

                                </div>

                                <div className="profile-detail-content">

                                    <span className="profile-detail-label">
                                        Email
                                    </span>

                                    <span className="profile-detail-value">

                                        {user?.email ||
                                            "Email not available"}

                                    </span>

                                </div>

                            </div>


                        </div>

                    </section>

                )}


                {/* =========================================
                    STATISTICS
                ========================================= */}

                {activeMenu !== "Profile" && (

                    <section className="stats-section">


                        <div className="stat-card">

                            <div className="stat-card-header">

                                <h3>
                                    Total Tasks
                                </h3>

                                <div className="stat-card-icon total-icon">

                                    <ListTodo
                                        size={22}
                                    />

                                </div>

                            </div>

                            <strong>
                                {totalTasks}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-header">

                                <h3>
                                    Completed
                                </h3>

                                <div className="stat-card-icon completed-icon">

                                    <CircleCheck
                                        size={22}
                                    />

                                </div>

                            </div>

                            <strong>
                                {completedTasks}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-header">

                                <h3>
                                    Pending
                                </h3>

                                <div className="stat-card-icon pending-icon">

                                    <Clock3
                                        size={22}
                                    />

                                </div>

                            </div>

                            <strong>
                                {pendingTasks}
                            </strong>

                        </div>

                    </section>

                )}


                {/* =========================================
                    ADD TASK + SEARCH
                ========================================= */}

                {activeMenu !== "Profile" && (

                    <TaskForm
                        onTaskAdded={
                            handleAddTask
                        }
                        onSearch={
                            handleSearch
                        }
                    />

                )}


                {/* =========================================
                    OLD PROFESSIONAL CHARTS
                    SIDE BY SIDE
                ========================================= */}

                {activeMenu ===
                    "Dashboard" && (

                    <section className="charts-section">


                        {/* =====================================
                            TASK COMPLETION DONUT
                        ===================================== */}

                        <div className="chart-card status-chart-card">

                            <div className="chart-header">

                                <div>

                                    <h3>
                                        Task Completion
                                    </h3>

                                    <p>
                                        Overall task progress
                                    </p>

                                </div>

                                <span className="chart-icon">
                                    ✓
                                </span>

                            </div>


                            <div className="chart-container">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                statusData
                                            }
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={
                                                72
                                            }
                                            outerRadius={
                                                105
                                            }
                                            paddingAngle={
                                                5
                                            }
                                            dataKey="value"
                                            stroke="none"
                                        >

                                            {statusData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            `status-${index}`
                                                        }
                                                        fill={
                                                            STATUS_COLORS[
                                                                index
                                                            ]
                                                        }
                                                    />

                                                )
                                            )}

                                        </Pie>


                                        <Tooltip
                                            contentStyle={{
                                                borderRadius:
                                                    "10px",
                                                border:
                                                    "1px solid #e2e8f0",
                                                boxShadow:
                                                    "0 8px 20px rgba(15, 23, 42, 0.12)"
                                            }}
                                            formatter={(
                                                value
                                            ) => [
                                                value,
                                                "Tasks"
                                            ]}
                                        />


                                        <Legend
                                            verticalAlign="bottom"
                                            height={35}
                                            iconType="circle"
                                        />

                                    </PieChart>

                                </ResponsiveContainer>


                                <div className="donut-center">

                                    <strong>
                                        {
                                            completedPercentage
                                        }%
                                    </strong>

                                    <span>
                                        Completed
                                    </span>

                                </div>

                            </div>


                            <div className="chart-summary">


                                <div className="chart-summary-item">

                                    <span className="chart-dot completed-dot">
                                    </span>

                                    <div>

                                        <span>
                                            Completed
                                        </span>

                                        <strong>
                                            {
                                                completedTasks
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="chart-summary-item">

                                    <span className="chart-dot pending-dot">
                                    </span>

                                    <div>

                                        <span>
                                            Pending
                                        </span>

                                        <strong>
                                            {
                                                pendingTasks
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            PRIORITY DISTRIBUTION BAR
                        ===================================== */}

                        <div className="chart-card priority-chart-card">

                            <div className="chart-header">

                                <div>

                                    <h3>
                                        Priority Distribution
                                    </h3>

                                    <p>
                                        Tasks by priority level
                                    </p>

                                </div>

                                <span className="chart-icon">
                                    !
                                </span>

                            </div>


                            <div className="chart-container">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <BarChart
                                        data={
                                            priorityData
                                        }
                                        margin={{
                                            top: 20,
                                            right: 10,
                                            left: -15,
                                            bottom: 5
                                        }}
                                        barCategoryGap="25%"
                                    >

                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            vertical={false}
                                            stroke="#e2e8f0"
                                        />


                                        <XAxis
                                            dataKey="name"
                                            tick={{
                                                fill: "#64748b",
                                                fontSize: 12
                                            }}
                                            axisLine={{
                                                stroke:
                                                    "#e2e8f0"
                                            }}
                                            tickLine={false}
                                        />


                                        <YAxis
                                            allowDecimals={false}
                                            tick={{
                                                fill: "#64748b",
                                                fontSize: 12
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />


                                        <Tooltip
                                            cursor={{
                                                fill:
                                                    "rgba(37, 99, 235, 0.05)"
                                            }}
                                            contentStyle={{
                                                borderRadius:
                                                    "10px",
                                                border:
                                                    "1px solid #e2e8f0",
                                                boxShadow:
                                                    "0 8px 20px rgba(15, 23, 42, 0.12)"
                                            }}
                                            formatter={(
                                                value
                                            ) => [
                                                value,
                                                "Tasks"
                                            ]}
                                        />


                                        <Bar
                                            dataKey="count"
                                            name="Tasks"
                                            radius={[
                                                10,
                                                10,
                                                3,
                                                3
                                            ]}
                                            barSize={58}
                                        >

                                            {priorityData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            `priority-${index}`
                                                        }
                                                        fill={
                                                            PRIORITY_COLORS[
                                                                index
                                                            ]
                                                        }
                                                    />

                                                )
                                            )}

                                        </Bar>

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>


                            <div className="chart-summary priority-summary">


                                <div className="chart-summary-item">

                                    <span className="chart-dot high-dot">
                                    </span>

                                    <div>

                                        <span>
                                            High
                                        </span>

                                        <strong>
                                            {
                                                priorityData[0]
                                                    .count
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="chart-summary-item">

                                    <span className="chart-dot medium-dot">
                                    </span>

                                    <div>

                                        <span>
                                            Medium
                                        </span>

                                        <strong>
                                            {
                                                priorityData[1]
                                                    .count
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="chart-summary-item">

                                    <span className="chart-dot low-dot">
                                    </span>

                                    <div>

                                        <span>
                                            Low
                                        </span>

                                        <strong>
                                            {
                                                priorityData[2]
                                                    .count
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                )}


                {/* =========================================
                    CALENDAR
                ========================================= */}

                {activeMenu ===
                    "Calendar" && (

                    <section className="calendar-section">

                        <h2>
                            Task Calendar
                        </h2>

                        <input
                            type="date"
                            value={
                                selectedDate
                            }
                            onChange={(e) =>
                                handleDateChange(
                                    e.target.value
                                )
                            }
                        />

                    </section>

                )}


                {/* =========================================
                    NOTIFICATIONS
                ========================================= */}

                {activeMenu ===
                    "Notifications" && (

                    <section className="notification-section">

                        <h2>
                            Notifications
                        </h2>


                        {notificationCount ===
                            0 ? (

                            <p>
                                No notifications.
                            </p>

                        ) : (

                            <>

                                {overdueTasks.map(
                                    (task) => (

                                    <button
                                        key={
                                            `overdue-${task.id}`
                                        }
                                        className="notification-item"
                                        onClick={() =>
                                            handleNotificationClick(
                                                task
                                            )
                                        }
                                    >

                                        ⚠️

                                        <span>
                                            {task.title}
                                            {" "}is overdue
                                        </span>

                                    </button>

                                ))}


                                {todayTasks.map(
                                    (task) => (

                                    <button
                                        key={
                                            `today-${task.id}`
                                        }
                                        className="notification-item"
                                        onClick={() =>
                                            handleNotificationClick(
                                                task
                                            )
                                        }
                                    >

                                        📅

                                        <span>
                                            {task.title}
                                            {" "}is due today
                                        </span>

                                    </button>

                                ))}


                                {tomorrowTasks.map(
                                    (task) => (

                                    <button
                                        key={
                                            `tomorrow-${task.id}`
                                        }
                                        className="notification-item"
                                        onClick={() =>
                                            handleNotificationClick(
                                                task
                                            )
                                        }
                                    >

                                        🔔

                                        <span>
                                            {task.title}
                                            {" "}is due tomorrow
                                        </span>

                                    </button>

                                ))}

                            </>

                        )}

                    </section>

                )}


                {/* =========================================
                    FILTER BUTTONS
                ========================================= */}

                {activeMenu ===
                    "Dashboard" && (

                    <div className="task-filter-buttons">

                        <button
                            className="task-filter-btn active"
                            onClick={() =>
                                setDisplayTasks(
                                    tasks
                                )
                            }
                        >
                            All ({totalTasks})
                        </button>


                        <button
                            className="task-filter-btn"
                            onClick={() =>
                                setDisplayTasks(
                                    tasks.filter(
                                        (task) =>
                                            !task.completed
                                    )
                                )
                            }
                        >
                            Pending ({pendingTasks})
                        </button>


                        <button
                            className="task-filter-btn"
                            onClick={() =>
                                setDisplayTasks(
                                    tasks.filter(
                                        (task) =>
                                            task.completed
                                    )
                                )
                            }
                        >
                            Completed ({completedTasks})
                        </button>

                    </div>

                )}


                {/* =========================================
                    TASKS
                ========================================= */}

                {activeMenu !== "Profile" && (

                    <section className="tasks-section">

                        <div className="section-header">

                            <h2>

                                {activeMenu ===
                                    "Completed"
                                    ? "Completed Tasks"
                                    : activeMenu ===
                                        "Pending"
                                        ? "Pending Tasks"
                                        : activeMenu ===
                                            "Calendar"
                                            ? "Tasks for Selected Date"
                                            : activeMenu ===
                                                "Notifications"
                                                ? "Notification Tasks"
                                                : activeMenu ===
                                                    "All Tasks"
                                                    ? "All Tasks"
                                                    : "My Tasks"}

                            </h2>


                            <span>
                                {displayTasks.length}
                                {" "}tasks
                            </span>

                        </div>


                        <TaskList
                            tasks={
                                displayTasks
                            }
                            onDelete={
                                handleDeleteTask
                            }
                            onUpdate={
                                handleUpdateTask
                            }
                        />

                    </section>

                )}

            </main>

        </div>
    );
}

export default TodoDashboard;

