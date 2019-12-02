import React from "react";
import { Table } from "antd";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "left"
    },
    {
        title: "Daily Earning",
        dataIndex: "dailyEarning",
        key: "dailyEarning",
        align: "left",
        defaultSortOrder: "descend",
        sorter: (a, b) =>
            a.dailyEarning.slice(0, -5) - b.dailyEarning.slice(0, -5)
    },
    {
        title: "Commission",
        dataIndex: "commission",
        key: "commission",
        align: "left"
    },
    {
        title: "Stash Id",
        dataIndex: "stashIdTruncated",
        key: "stashIdTruncated",
        align: "left"
    }
    // {
    //     title: "Controller Id",
    //     dataIndex: "controllerId",
    //     key: "controllerId"
    // }
];

export default function ValidatorTable(props) {
    const { dataSource } = props;
    return (
        <Table dataSource={dataSource} columns={columns} pagination={false} />
    );
}
