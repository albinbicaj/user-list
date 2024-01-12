import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Spin } from "antd";
import axios from "axios";
import "./UserPosts.css";

type Post = {
  id: number;
  title: string;
  body: string;
  reactions: string;
  tags: string;
};

type UserData = {
  limit: number;
  skip: number;
  total: number;
  posts: Post[];
};

function UserPosts() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://dummyjson.com/users/${id}/posts`
      );
      const data: UserData = response.data;
      setPosts(data.posts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin />
      </div>
    );
  }

  return (
    <div className="user-posts-container">
      <div className="post-cards-container">
        {posts?.map((post) => (
          <Card
            title={
              <p
                style={{
                  whiteSpace: "normal",
                }}
              >
                <strong>{post.title}</strong>
              </p>
            }
            bordered={true}
            key={post.id}
            className="post-card"
          >
            <p style={{ fontWeight: 500 }}>{post.body}</p>
            <p style={{ fontWeight: 700 }}>Reaction: {post.reactions}</p>
            <p style={{ fontWeight: 700 }}>Tags: #{post.tags}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserPosts;
