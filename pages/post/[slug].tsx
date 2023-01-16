import { GetStaticProps, PreviewData } from "next";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityclient, urlFor } from "../../sanity";
import { Posts } from "../../typing";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface Props {
  post: Posts;
}

interface FormValues {
  _id: number;
  name: string;
  comment: string;
  email: string;
}

export default function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    alert(JSON.stringify(data));

    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        setSubmitted(false);
      });
  };
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
      {submitted ? (
        <div className="flex flex-col py-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">Thank for submmiting</h3>
          <p>once it has been approved</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed article</h3>
          <h4 className="text-3xl font-bold">Leave a comment below</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>

            <input
              {...register("name", { required: true })}
              className="shadow  border  rounded py-2  px-3 form-input mt-1 block  w-full ring-yellow-500  outline-none  focus:ring "
              placeholder="ekene meshach"
              type="text"
            />
          </label>

          <label className="block mb-5">
            <span className="text-gray-700">Email</span>

            <input
              {...register("email", { required: true })}
              className="shadow  border  rounded py-2  px-3 form-input mt-1 block  w-full ring-yellow-500  outline-none  focus:ring "
              placeholder="name123@gmail.com"
              type="email"
              {...register("email")}
            />
          </label>

          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow  border  rounded py-2  px-3 form-input mt-1 block  w-full ring-yellow-500  outline-none  focus:ring "
              {...register("comment")}
              placeholder="About you"
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name ? (
              <span className="text-red-500">The name is required</span>
            ) : null}
            {errors.email ? (
              <span className="text-red-500">The email is required</span>
            ) : null}
            {errors.comment ? (
              <span className="text-red-500">The comment is required</span>
            ) : null}
          </div>

          <input
            className="shadow hover:bg-yellow-400 bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            type="submit"
          />
        </form>
      )}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto">
        <h3 className="text-4xl">comments</h3>
        <hr className="pb-2" />
        {post.comments?.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}</span>:{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
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
