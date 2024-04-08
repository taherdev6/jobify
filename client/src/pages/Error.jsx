import { Link, useRouteError } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";

import notFound from "../assets/images/not-found.svg";
const Error = () => {
  const error = useRouteError();
  console.log(error);
  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={notFound} alt="not found" />
          <h3>Error! Page not found</h3>
          <p>we can't seem to find the page you're looking for</p>
          <Link to="/dashboard">Go To Dashboard</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div>
        <h3>something went wrong</h3>
      </div>
    </Wrapper>
  );
};

export default Error;
