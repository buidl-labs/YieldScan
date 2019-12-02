import React from "react";
import { Table } from "antd";

const data = [
    {
        key: "1",
        validatorName: "POLYCHAIN LABS 1",
        reward: "0.155 KSM",
        commission: "0.00%",
        stashId: "HutJ….rt1xs",
        controllerId: "Gw9k….xiVz2"
    }
];

const columns = [
    {
        title: "Name",
        dataIndex: "validatorName",
        key: "validatorName"
    },
    {
        title: "Daily Reward",
        dataIndex: "reward",
        key: "reward"
    },
    {
        title: "Commission",
        dataIndex: "commission",
        key: "commission"
    },
    {
        title: "Stash Id",
        dataIndex: "stashId",
        key: "stashId"
    },
    {
        title: "Controller Id",
        dataIndex: "controllerId",
        key: "controllerId"
    }
];

export default function ValidatorTable() {
    return <Table dataSource={data} columns={columns} pagination={false} />;
}
