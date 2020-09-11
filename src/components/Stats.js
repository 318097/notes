import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button } from "antd";
import _ from "lodash";
import { toggleStatsModal, fetchStats } from "../store/actions";
import colors from "@codedrops/react-ui";
import { Doughnut, HorizontalBar } from "react-chartjs-2";
import { extractTagCodes } from "../utils";

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
    flex: 0 1 45%;
  }
`;

const Stats = ({ tagsCodes, stats, fetchStats }) => {
  useEffect(() => {
    fetchStats();
  }, []);

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

  return (
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
        <div className="note-types-chart">
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
      </div>
    </StyledContainer>
  );
};

const StatsWrapper = ({ statsModal, toggleStatsModal, stats, ...rest }) => {
  const handleClose = () => toggleStatsModal(false);
  return (
    <Modal
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
      width="900px"
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
