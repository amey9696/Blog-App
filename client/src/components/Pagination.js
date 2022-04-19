import { Link } from "react-router-dom";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Pagination = ({ path, count, page, perPage }) => {
    let totalPages = Math.ceil(count / perPage);
    let startLoop = page;
    let diff = totalPages - page;
    if (diff <= 3) {//later change value to 5 or 10 i.e how many card display on page 1 on pagination (also change in backend postController.js file (const perPage=3;) here)
        startLoop = totalPages - 3;
    }
    let endLoop = startLoop + 3;
    if (startLoop <= 0) {
        startLoop = 1;
    }
    const links = () => {
        const store = [];
        for (let i = startLoop; i <= endLoop; i++) {
            store.push(
                <li key={i} className={i == page ? 'active' : ''}>
                    <Link to={`/${path}/${i}`}>{i}</Link>
                </li>
            );
        }
        return store;
    }
    const next = () => {
        if (page < totalPages) {
            return (
                <li>
                    <Link to={`/${path}/${parseInt(page) + 1}`}><BsChevronRight /></Link>
                </li>
            )
        }
    }
    const prev = () => {
        if (page > 1) {
            return (
                <li>
                    <Link to={`/${path}/${parseInt(page) - 1}`}><BsChevronLeft /></Link>
                </li>
            )
        }
    }
    return totalPages && count > 5 ? (
        <div className='pagination'>
            {prev()}
            {links()}
            {next()}
        </div>
    ) : ('');
};

export default Pagination; 