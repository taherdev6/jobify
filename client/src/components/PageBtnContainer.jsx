import { useAllJobsContext } from "../pages/AllJobs";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import customFetch from "../utils/customFetch";
import { useState } from "react";
const PageBtnContainer = () => {
  const url = useLocation();
  const navigate = useNavigate();
  const { data } = useAllJobsContext();
  const { numOfPages, currentPage } = data;
  const [count, setCount] = useState(0);
  const handlePageChange = (pageNumber) => {
    if (pageNumber === 0) {
      pageNumber = numOfPages;
    }
    if (pageNumber === numOfPages + 1) {
      pageNumber = 1;
    }

    const query = new URLSearchParams(url.search);
    query.set("page", pageNumber);
    navigate(`/dashboard/all-jobs?${query.toString()}`);
  };
  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        key={pageNumber}
        className={`btn page-btn ${activeClass && "active"}`}
        onClick={() => {
          handlePageChange(pageNumber);
        }}
      >
        {pageNumber}
      </button>
    );
  };
  const renderPageButton = () => {
    const pageButtons = [];
    pageButtons.push(
      addPageButton({ pageNumber: 1, activeClass: currentPage === 1 })
    );
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({ pageNumber: currentPage - 1, activeClass: false })
      );
    }
    // current page
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(
        addPageButton({ pageNumber: currentPage, activeClass: true })
      );
    }

    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(
        addPageButton({ pageNumber: currentPage + 1, activeClass: false })
      );
    }

    pageButtons.push(
      addPageButton({
        pageNumber: numOfPages,
        activeClass: currentPage === numOfPages,
      })
    );
    return pageButtons;
  };
  // const pageButtons = [...Array(numOfPages)].map((_, i) => {
  //   return renderPageButton();
  // });

  return (
    <Wrapper>
      <button
        className="btn prev-btn"
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(currentPage - 1);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {renderPageButton()}
        {/* {currentPage - 2 > -1 && pageButtons[currentPage] - 2}
        {pageButtons[currentPage - 1]}
        {pageButtons[currentPage]}
        <button className="btn page-btn">...</button>
        {pageButtons[pageButtons.length - 1]} */}
        {/* {numOfPages < 5 && pageButtons.map((btn) => btn)}
        {pageButtons.length >= 5 && pageButtons.map((btn, i) => {})} */}
      </div>
      <button
        className="btn next-btn"
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(currentPage + 1);
        }}
      >
        <HiChevronDoubleRight />
        next
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;
