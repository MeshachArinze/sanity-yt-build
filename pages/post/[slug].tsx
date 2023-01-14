import Header from "../../components/Header";
import { sanityclient,  } from "../../sanity";

export default function Slug() {
  return (
    <div>
      <Header />
    </div>
  );
}

export const getStaProps = () => {
  const query = `*[_type == "post"] {
  _id,
    
    slug {
    current
    }
    
}`;
};
