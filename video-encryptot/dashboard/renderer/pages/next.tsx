import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layout,
  Result,
} from 'antd';
import {Dashboard} from "../container/dashboard";

const {
  Header,
  Content,
} = Layout;

function Next() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript-ant-design)</title>
      </Head>

      <Header>
        <Link href="/home">
          <a>Go to home page</a>
        </Link>
      </Header>

      <Content style={{ padding: 48 }}>
        <Dashboard />
      </Content>
    </React.Fragment>
  );
};

export default Next;
