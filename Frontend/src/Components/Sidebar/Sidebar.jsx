import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";
import { MdHomeFilled } from "react-icons/md";
import { AiFillTool } from "react-icons/ai";
import { IoStatsChart } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
const Sidebar = () => {
    return (
        <div>
            <h3 className={styles["title"]}>API Management</h3>
            <nav className="sidebar-nav">
                <li className={styles["nav-item"]}>
                    <Link to="/home" className={styles['link']}>
                        <span className={styles["menu-Icon"]}>
                            <MdHomeFilled />
                        </span>
                        <span className={styles["menu-Name"]}>Home</span>
                    </Link>
                </li>
                <li className={styles["nav-item"]}>
                    <Link to="/apitracelogs" className={styles['link']}>
                        <span className={styles["menu-Icon"]}>
                            <FiActivity />
                        </span>
                        <span className={styles["menu-Name"]}>Trace Logs</span>
                    </Link>
                </li>
                <li className={styles["nav-item"]}>
                    <Link to="/analysis" className={styles['link']}>
                        <span className={styles["menu-Icon"]}>
                            <IoStatsChart />
                        </span>
                        <span className={styles["menu-Name"]}>Analysis</span>
                    </Link>
                </li>
                <li className={styles["nav-item"]}>
                    <Link to="/apilist" className={styles['link']}>
                        <span className={styles["menu-Icon"]}>
                            <AiFillTool />
                        </span>
                        <span className={styles["menu-Name"]}>Configuration</span>
                    </Link>
                </li>
            </nav>
        </div>
    );
};

export default Sidebar;
