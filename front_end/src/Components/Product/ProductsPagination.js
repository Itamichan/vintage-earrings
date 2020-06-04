import React from 'react';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import "./ProductsPagination.scss";

const ProductsPagination = ({currentPage, setCurrentPage, ItemsPerPage, totalItemsNr}) => {

    let pagesNr = Math.ceil(totalItemsNr / ItemsPerPage);

    let paginationItems = [];

    for (let i = 1; i <= pagesNr; i++) {
        paginationItems.push(
            <PaginationItem
                key={i}
                className={'pagination-item-style'}
                active={i === currentPage}>
                <PaginationLink className={'pagination-link-style'} onClick={() => setCurrentPage(i)} >
                    {i}
                </PaginationLink>
            </PaginationItem>
        )
    }

    return (
        <Pagination className="pagination justify-content-center" aria-label="Page navigation" >
            {paginationItems}
        </Pagination>
    );
};

export default ProductsPagination;