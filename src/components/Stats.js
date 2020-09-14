import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button } from "antd";
import _ from "lodash";
import { toggleStatsModal, fetchStats } from "../store/actions";
import colors from "@codedrops/react-ui";
import { Doughnut, HorizontalBar, Bar } from "react-chartjs-2";
import { extractTagCodes } from "../utils";

const StyledContainer = styled.div`
  height: 100%;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  .wrapper {
    margin: 10px 0;
    flex: 1 1 50%;
    display: flex;
    justify-content: space-between;
  }
  .chart {
    flex: 1 1 50%;
    width: 100%;
    margin: 0 auto;
  }
`;

const getChartData = ({ data = {}, type, tagsCodes } = {}) =>
  _.reduce(
    _.get(data, type, {}),
    (acc, value, label) => {
      acc.labels.push(label.toUpperCase());
      acc.values.push(value);
      if (type === "tags") acc.colors.push(tagsCodes[label]);
      return acc;
    },
    { labels: [], values: [], colors: [] }
  ) || {};

const Stats = ({ tagsCodes, stats, fetchStats }) => {
  useEffect(() => {
    fetchStats();
  }, []);

  const tagsData = getChartData({ data: stats, type: "tags", tagsCodes });
  const typesData = getChartData({ data: stats, type: "types" });
  const statusData = getChartData({ data: stats, type: "status" });
  const createdOnData = getChartData({ data: stats, type: "created" });

  return (
    <StyledContainer>
      <div className="wrapper">
        <div className="chart">
          <Doughnut
            data={{
              labels: statusData.labels,
              datasets: [
                {
                  backgroundColor: [colors.green, colors.orange, colors.orchid],
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
        <div className="chart">
          <Bar
            data={{
              labels: createdOnData.labels,
              datasets: [
                {
                  backgroundColor: Object.values(colors),
                  data: createdOnData.values,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      fontSize: 10,
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontSize: 10,
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
      </div>

      <div className="wrapper">
        <div className="chart">
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
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      fontSize: 10,
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontSize: 10,
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
        <div className="chart">
          <Doughnut
            data={{
              labels: typesData.labels,
              datasets: [
                {
                  backgroundColor: [colors.coffee, colors.yellow, colors.blue],
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
      </div>
    </StyledContainer>
  );
};

const StatsWrapper = ({ statsModal, toggleStatsModal, stats, ...rest }) => {
  const handleClose = () => toggleStatsModal(false);
  return (
    <Modal
      destroyOnClose={true}
      title={
        <div>
          STATS{" "}
          <span style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
            (Total:{stats.total})
          </span>
        </div>
      }
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
      <Stats stats={stats} {...rest} />
    </Modal>
  );
};

const mapStateToProps = ({ settings, statsModal, stats }) => ({
  statsModal,
  tagsCodes: extractTagCodes(settings.tags),
  stats,
});

const mapDispatchToProps = { toggleStatsModal, fetchStats };

export default connect(mapStateToProps, mapDispatchToProps)(StatsWrapper);
