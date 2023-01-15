import { GetStaticProps, PreviewData } from "next";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityclient, urlFor } from "../../sanity";
import { Posts } from "../../typing";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  post: Posts;
}

interface FormValues  {
    _id: number,
  name: string;
  comment: string;
  email: string;
};

export default function Post({ post }: Props) {
    const {register, handleSubmit, formState: { errors}, } = useForm<FormValues>()
  return (
    <div>
      <Header />
      <img
        className="w-full h-[20rem] object-center object-cover "
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            className="w-10 h-10 rounded-full"
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">
              {post.author.name} - published at{" "}
              {new Date(post._credential).toLocaleTimeString()}
            </span>
          </p>
        </div>

        <div>
          <PortableText
          className=""
          content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            serializers={{
              h1: (props: any) => <h1 style={{ color: "red" }} {...props} />,
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5">{...props}</h1>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover::underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow" />

      <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
        <h3 className="text-sm text-yellow-500">Enjoyed article</h3>
        <h4 className="text-3xl font-bold">Leave a comment below</h4>
        <hr className="py-3 mt-2" />
      </form>
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
  const query = `*[_type == "post" && slug.current == "my-first-post"][0]{
        _id,
        _createdAt,
        title,

          
          
        author-> {
            name,
            image
        },
            description,
            mainImage,
            slug,
            body
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
