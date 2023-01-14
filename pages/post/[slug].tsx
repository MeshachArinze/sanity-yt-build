import { GetStaticProps, PreviewData } from "next";
import Header from "../../components/Header";
import { sanityclient,  } from "../../sanity"; 
import { Post } from "../../typing";

interface Props {
    post: Post
}

export default function Post({post}: Props) {
  return (
    <div>
      <Header />
    </div>
  );
}

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
  _id,
    
    slug {
    current
    }
    
}`;

const posts = await sanityclient.fetch(query);

const paths = posts.map((post: Post) => ({
    params: {
        slug: post.slug.current,
    }
}))

return {
    paths, 
    fallback: "blocking"
}

};

export const getStaticProps: ({ params }: { params: any }) => Promise<{}> = async ({
  params,
}) => {
  const query = `*[_type == "post && slug.current == $slug][0] {
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
            description,
            mainImage,
            slug,
            body
        ]
    }`;

  const post = await sanityclient.fetch(query, {
    slug: params?.slug,
  });

  return {};
};