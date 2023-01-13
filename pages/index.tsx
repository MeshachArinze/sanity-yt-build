import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import { sanityclient, urlfor } from "../sanity";
import { Post } from "../typing";

interface Props {
  posts: [Post];
}

function Home({ posts }: Props): JSX.Element {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-yellow-400 border-black border-y py-10 lg:py-0">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{" "}
            is a place to write, read and correct
          </h1>
          <h2>
            Its easy and free to post your thinking on any topic and correct
            millions readers
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-32 lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt=""
        />
      </div>

      <div>
        {posts.length && posts.map((post) => {
          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div>
                <img src={urlfor(post.mainImage).url()!} alt="" />
                <div>
                  <div>
                    <p>{post.title}</p>
                    <p>{post.description} by {post.author.name}</p>
                  </div>
                  <img src={urlfor(post.author.image).url()!} alt="" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] {
  _id,
    title,
    slug,
    author -> {
      name, 
      image
    },
    description,
    mainImage,
    slug
  `;

  const posts = await sanityclient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};

export default Home;
