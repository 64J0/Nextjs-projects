// Pages that begin with '[' and end with ']' are dynamic pages in Next.js
import React, { useEffect } from "react";
import Head from "next/head";
import hljs from "highlight.js";

import Layout from "../../components/layout";
import Date from "../../components/date";

import { getAllPostIds, getPostData } from "../../lib/posts";

import utilStyles from "../../styles/utils.module.css";

import postStyles from "./styles.module.scss";

export default function Post({ postData }) {
  useEffect(() => {
    function highlightPreElement() {
      let preEl = document.querySelectorAll("pre");

      return (
        preEl && preEl.forEach((element) => {
          element.childNodes.forEach((child) => {
            child.className = child.className.replace(/language-/, "");

            return hljs.highlightBlock(child);
          });
        })
      );
    }

    highlightPreElement();
  }, []);

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <article className={postStyles.container}>
        <h1 className={utilStyles.headingX1}>
          {postData.title}
        </h1>
        <div className={`${utilStyles.textRight} + ${utilStyles.lightText}`}>
          <Date dateString={postData.date} /><br/>
          {postData.tags && <small>Tags: [{postData.tags.join(", ")}]</small>}
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
