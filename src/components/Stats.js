import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button } from "antd";
import "easymde/dist/easymde.min.css";
import _ from "lodash";
import { toggleStatsModal } from "../store/actions";
import colors from "@codedrops/react-ui";
import axios from "axios";
import { Doughnut, HorizontalBar } from "react-chartjs-2";

const StyledContainer = styled.div`
  height: 100%;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  .tags-chart {
    flex: 1 1 50%;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
  .pie-chart-wrapper {
    margin-top: 10px;
    flex: 1 1 50%;
    display: flex;
    justify-content: space-around;
  }
  .note-types-chart {
    flex: 0 1 40%;
    /* border: 1px dashed lightgrey; */
  }
`;

const Stats = ({ statsModal, toggleStatsModal, appLoading, tagsCodes }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const {
      data: { stats },
    } = await axios.get("/posts/stats");
    console.log(stats);
    setStats(stats);
  };

  const handleClose = () => toggleStatsModal(false);

  const tagsData =
    _.reduce(
      _.get(stats, "tags", {}),
      (acc, value, label) => {
        acc.labels.push(label.toUpperCase());
        acc.values.push(value);
        acc.colors.push(tagsCodes[label]);
        return acc;
      },
      { labels: [], values: [], colors: [] }
    ) || {};

  const typesData =
    _.reduce(
      _.get(stats, "types", {}),
      (acc, value, label) => {
        acc.labels.push(label);
        acc.values.push(value);
        return acc;
      },
      { labels: [], values: [] }
    ) || {};

  const statusData =
    _.reduce(
      _.get(stats, "status", {}),
      (acc, value, label) => {
        acc.labels.push(label);
        acc.values.push(value);
        return acc;
      },
      { labels: [], values: [] }
    ) || {};

  console.log("tagg", tagsCodes);

  return (
    <Modal
      title={"STATS"}
      centered={true}
      style={{ padding: "0" }}
      visible={statsModal}
      width="60vw"
      onCancel={handleClose}
      footer={[
        <Button key="cancel-button" onClick={handleClose}>
          Close
        </Button>,
      ]}
    >
      <StyledContainer>
        <div className="tags-chart">
          <HorizontalBar
            data={{
              labels: tagsData.labels,
              datasets: [
                {
                  backgroundColor: tagsData.colors,
                  data: tagsData.values,
                },
              ],
            }}
            width={100}
            height={50}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
              legend: {
                display: false,
              },
            }}
          />
        </div>

        <div className="pie-chart-wrapper">
          <div className="note-types-chart">
            <Doughnut
              data={{
                labels: typesData.labels,
                datasets: [
                  {
                    backgroundColor: [
                      colors.watermelon,
                      colors.yellow,
                      colors.blue,
                    ],
                    data: typesData.values,
                  },
                ],
              }}
              options={{
                cutoutPercentage: 0,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  position: "bottom",
                },
              }}
            />
          </div>
          <div className="note-types-chart">
            <Doughnut
              data={{
                labels: statusData.labels,
                datasets: [
                  {
                    backgroundColor: [
                      colors.green,
                      colors.orange,
                      colors.orchid,
                    ],
                    data: statusData.values,
                  },
                ],
              }}
              options={{
                cutoutPercentage: 0,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  position: "bottom",
                },
                tooltips: {
                  enabled: true,
                },
              }}
            />
          </div>
        </div>
      </StyledContainer>
    </Modal>
  );
};

const mapStateToProps = ({
  session,
  activeCollection,
  settings,
  appLoading,
  statsModal,
}) => ({
  session,
  activeCollection,
  appLoading,
  statsModal,
  tagsCodes: _.reduce(_.get(settings, "tags", []), (acc, { label, color }) => ({
    ...acc,
    [label]: color,
  })),
});

const mapDispatchToProps = { toggleStatsModal };

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
