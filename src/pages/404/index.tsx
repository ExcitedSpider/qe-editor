import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="h-screen flex-col align-center justify-center">
      <h2>404</h2>
      <p>没有发现你要找的页面</p>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default Page404;
