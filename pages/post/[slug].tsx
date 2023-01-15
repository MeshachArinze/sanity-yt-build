import { GetStaticProps, PreviewData } from "next";
import Header from "../../components/Header";
import { sanityclient, urlFor } from "../../sanity";
import { Posts } from "../../typing";

interface Props {
  post: Posts;
}

export default function Post({ post }: Props) {
  return (
    <div>
      <Header />
      <img
        className="w-full h-40 object-cover "
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <img src={urlFor(post.author.image).url()!} className="w-10 h-10 rounded-full" />
          <p className="font-extralight text-sm">
            Blog post by {" "}
            <span className="text-green-600">{post.author.name} - published at  {new Date(post._credential).toLocaleTimeString()}</span>
          </p>
        </div>
      </article>
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

  const paths = posts.map((post: Posts) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 1,
  };
};
