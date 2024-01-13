import { useCallback, useEffect, useState } from "react";
import { Table, Pagination, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import Lottie from "lottie-react";
import axios from "axios";
import "./UserList.css";
import NoData from "../../animation/NoData.json";

type UserData = {
  limit: number;
  skip: number;
  total: number;
  users: User[];
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [skip, setSkip] = useState<number>(0);
  const [isloading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://dummyjson.com/users/search?q=${search}&limit=10&skip=${skip}`
      );

      const data: UserData = res.data;

      setUsers(data.users);
      setTotalUsers(data.total);
      setIsLoading(false);
    } catch (error) {
      console.error(error, "error");
    }
  }, [skip, search]);

  useEffect(() => {
    fetchUsers();
  }, [skip, search]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setSkip(0);
  };

  const handleOnPageChange = (page: number) => {
    setSkip(10 * (page - 1));
    setCurrentPage(page);
  };

  return (
    <div className="user-list-container">
      <div className="search-bar-container">
        <Input
          placeholder="Search User"
          size="middle"
          className="search-input"
          onChange={(event) => handleSearch(event.target.value)}
          suffix={
            <Button
              className="button-input"
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => fetchUsers()}
            />
          }
        />
      </div>
      {users.length === 0 && !isloading ? (
        <Lottie
          animationData={NoData}
          loop
          autoplay
          style={{ width: 480, height: 480 }}
        />
      ) : (
        <Table
          className="user-table"
          pagination={{
            position: ["none", "none"],
          }}
          loading={isloading}
          dataSource={users}
          columns={[
            {
              title: "Profile Picture",
              render: (user: User) => (
                <Space size={16} wrap>
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                    }}
                  >
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </Avatar>
                </Space>
              ),
            },
            {
              title: "First Name",
              dataIndex: "firstName",
              sorter: (a: User, b: User) =>
                a.firstName.localeCompare(b.firstName),
            },
            {
              title: "Last Name",
              dataIndex: "lastName",
              sorter: (a: User, b: User) =>
                a.lastName.localeCompare(b.lastName),
            },
            {
              title: "Email",
              dataIndex: "email",
              sorter: (a: User, b: User) => a.email.localeCompare(b.email),
            },
            {
              title: "Posts",
              render: (user: User) => (
                <div>
                  <Button className="posts-button">
                    <Link to={`/${user.id}`}>View Posts</Link>
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
      <Pagination
        current={currentPage}
        total={totalUsers}
        onChange={handleOnPageChange}
        showSizeChanger={false}
        className="pagination"
      />
    </div>
  );
};

export default UserList;
