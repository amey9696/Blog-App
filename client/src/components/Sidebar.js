import { Link } from 'react-router-dom';
const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar_element'>
                <h3>Setting</h3>
            </div>
            <div className='sidebar_element'>
                <Link to='/updatePassword'>Change Password</Link>
            </div>
            <div className='sidebar_element'>
                <Link to="/updateName">Change Name</Link>
            </div>
        </div>
    );
};
export default Sidebar;