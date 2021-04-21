import React, { useState, Fragment } from "react";
import {
  Radio,
  Switch,
  Input,
  Rate,
  Select,
  Popover,
  Checkbox,
  Card,
  Modal,
  Empty,
} from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import colors, { Icon, Tag } from "@codedrops/react-ui";
import { saveSettings, updateNote } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import short from "short-uuid";
import { statusFilter } from "../../constants";

const { TextArea } = Input;
const { Option } = Select;

const ControlsWrapper = styled.div`
  background: white;
  margin-bottom: 8px;
  width: 218px;
  padding: 14px 12px;
  border-radius: 12px;
  border: 1px solid ${colors.shade2};
  box-shadow: 3px 3px 3px ${colors.shade2};
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .hashtag {
    font-size: 1rem;
    font-family: Cascadia-SemiBold;
  }
  .slug {
    background: ${colors.primary};
    width: 100%;
    color: white;
    padding: 4px;
    border-radius: 2px;
    font-size: 0.9rem;
    transition: 0.4s;
    cursor: pointer;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background: ${colors.orchid};
    }
  }
  .empty {
    opacity: 0.8;
    text-align: center;
    font-size: 1rem;
  }
  .resource-id {
    background: ${colors.strokeOne};
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    font-size: 1.2rem;
    margin-right: 4px;
    cursor: pointer;
    transition: 0.4s;
    &:hover {
      background: ${colors.strokeTwo};
    }
  }
  .notes-container {
    padding: 8px 0px;
    .note {
      background: ${colors.feather};
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 4px;
      overflow-wrap: break-word;
    }
  }
  .ant-radio-wrapper {
    font-size: 12px;
  }
  .chain-title {
    margin-bottom: 4px;
    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &.social-platforms {
    position: relative;
    .blocker {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.6;
      z-index: 1;
    }
  }
`;

const Controls = ({
  note,
  dispatch,
  view,
  chains = [],
  goToPost,
  socialPlatforms: socialPlatformsList = [],
  saveSettings,
}) => {
  const {
    tags = [],
    _id,
    liveId,
    slug = "",
    index,
    createdAt,
    updatedAt,
    publishedAt,
    resources = [],
    visible,
    status,
    socialStatus,
    rating,
    notes: personalNotes = [],
    type,
    chainedTo = [],
    socialPlatforms,
  } = note || {};
  const [liveIdEditor, setLiveIdEditor] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [editCaptionId, setEditCaptionId] = useState(null);
  const [suffix, setSuffix] = useState();
  const [personalNote, setPersonalNote] = useState("");
  const [blockSocialPlatforms, setBlockSocialPlatforms] = useState(true);

  const updateProperties = async (update) =>
    await dispatch(updateNote({ _id, liveId, ...update }));

  const copy = (text, addSuffix) => () => {
    copyToClipboard(addSuffix && suffix ? `${text}_${suffix}` : text);
  };

  const handleAddPersonalNote = () => {
    const newNote = [
      ...personalNotes,
      { _id: short.generate(), content: personalNote },
    ];
    updateProperties({ notes: newNote });
    setTimeout(() => setPersonalNote(""));
  };

  const updateLiveId = (e) => {
    const { value: id } = e.target;
    if (!/^\d+$/.test(id)) return;
    updateProperties({ liveId: id });
    setLiveIdEditor(false);
  };

  const updateSuffix = (e) => {
    setSuffix(e.target.value);
  };

  const toggleChain = (value) =>
    updateProperties({ updatedChainedTo: value, chainedTo });

  const hashtags = tags.map((tag) => `#${tag}`).join(" ");
  const rdySlug = `RDY${index}-${slug}`;
  const slugWithLiveId = `${liveId}-${slug}`;

  const createdAtFormatted = moment(createdAt).format("DD MMM, YY");
  const updatedAtFormatted = moment(updatedAt).format("DD MMM, YY");

  const createdTimeAgo = moment(createdAt).fromNow();
  const updatedTimeAgo = moment(updatedAt).fromNow();

  const publishedOn = publishedAt
    ? moment(publishedAt).format("DD MMM, YY")
    : "-";
  const chainedPosts = chains.filter((chain) =>
    chain.chainedItems.includes(_id)
  );

  const SocialPlatforms = (
    <ControlsWrapper className="social-platforms">
      <div className="header">
        <h4>Social Platforms</h4>
      </div>
      <Checkbox.Group
        onChange={(values) => updateProperties({ socialPlatforms: values })}
        value={socialPlatforms}
        options={_.map(socialPlatformsList, (item) => ({
          ...item,
          value: item.key,
        }))}
      />
      {blockSocialPlatforms && (
        <div
          className="blocker"
          onDoubleClick={() => setBlockSocialPlatforms(false)}
        ></div>
      )}
    </ControlsWrapper>
  );

  const SocialStatus = (
    <ControlsWrapper>
      <div className="header">
        <h4>Social status</h4>
      </div>
      <Radio.Group
        onChange={({ target: { value } }) =>
          updateProperties({ socialStatus: value })
        }
        value={socialStatus}
      >
        {["NONE", "READY", "POSTED"].map((state) => (
          <Radio className="block" key={state} value={state}>
            {state}
          </Radio>
        ))}
      </Radio.Group>
    </ControlsWrapper>
  );

  const Rating = (
    <ControlsWrapper>
      <h4>Rating</h4>
      <Rate
        value={rating || 0}
        onChange={(value) => updateProperties({ rating: value })}
      />
    </ControlsWrapper>
  );

  const Notes = (
    <ControlsWrapper>
      <div className="header">
        <h4>Notes</h4>
        {personalNotes.length ? (
          <Tag>{`Total: ${personalNotes.length}`}</Tag>
        ) : null}
      </div>
      <div className="notes-container">
        {personalNotes.length ? (
          personalNotes.map((note, index) => (
            <div key={note._id} className="note">
              {`${index + 1}. ${note.content}`}
            </div>
          ))
        ) : (
          <div className="empty">Empty</div>
        )}
      </div>
      <div className="add-note-container">
        <TextArea
          rows={1}
          placeholder="Add Note.."
          value={personalNote}
          onChange={({ target: { value } }) => setPersonalNote(value)}
          onPressEnter={handleAddPersonalNote}
        />
      </div>
    </ControlsWrapper>
  );

  const Chain = (
    <ControlsWrapper>
      <div className="header">
        <h4>Chained In</h4>
      </div>
      <Select
        mode="multiple"
        className="w-100"
        placeholder="Chains"
        value={chainedTo}
        onChange={toggleChain}
      >
        {chains.map(({ _id, title, status }) => (
          <Option key={_id} value={_id} disabled={status === "POSTED"}>
            {title}
          </Option>
        ))}
      </Select>
      {chainedTo && !!chainedTo.length && (
        <Fragment>
          <br />
          <br />
          <div className="header">
            <h4>Chains</h4>
          </div>
          <div>
            {chainedPosts.map((chain) => (
              <div key={chain.title} className="chain-title">
                &#9679;{" "}
                <span onClick={() => goToPost(chain._id, _id)}>
                  {chain.title}
                </span>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </ControlsWrapper>
  );

  const Status = (
    <ControlsWrapper>
      <div className="header">
        <h4>Status</h4>
        {liveId && (
          <Fragment>
            {liveIdEditor ? (
              <Input
                style={{ width: "30px", height: "18px", fontSize: "1rem" }}
                size="small"
                defaultValue={liveId}
                onBlur={updateLiveId}
              />
            ) : (
              <Tag
                color={colors.green}
                onDoubleClick={() => setLiveIdEditor(true)}
              >{`Live Id: ${liveId}`}</Tag>
            )}
          </Fragment>
        )}
      </div>
      <Radio.Group
        onChange={({ target: { value } }) =>
          updateProperties({ status: value })
        }
        value={status}
      >
        {statusFilter.map(({ label, value }) => (
          <Radio className="block" key={value} value={value}>
            {label}
          </Radio>
        ))}
      </Radio.Group>
    </ControlsWrapper>
  );

  const Naming = (
    <ControlsWrapper className="naming">
      <div className="header">
        <h4>Naming/Suffix</h4>
        {!_.isEmpty(socialPlatformsList) && (
          <Tag onClick={() => setShowCaptionModal(true)} color="nbPink">
            Caption
          </Tag>
        )}
      </div>
      <Select
        allowClear
        size="small"
        className="w-100 mb"
        placeholder="Suffix Options"
        value={suffix}
        onChange={(value) => setSuffix(value)}
      >
        {socialPlatformsList.map(({ label, key }) => (
          <Option key={label} value={key}>
            {label}
          </Option>
        ))}
      </Select>

      <Input
        className="mb"
        size="small"
        allowClear
        placeholder="Suffix"
        value={suffix}
        autoComplete={false}
        onChange={updateSuffix}
      />
      <div className="slug" onClick={copy(rdySlug, true)}>
        {rdySlug}
      </div>
      {!!liveId && (
        <div className="slug" onClick={copy(slugWithLiveId, true)}>
          {slugWithLiveId}
        </div>
      )}

      <div className="divider"></div>
      <div className="header">
        <h4>Resources</h4>
        <Icon
          type="plus"
          hover
          size={10}
          onClick={() => dispatch(updateNote(note, "CREATE_RESOURCE"))}
        />
      </div>

      {resources.map((resource, index) => (
        <Popover key={resource} placement="bottom" content={resource}>
          <div className="resource-id" onClick={copy(resource)}>
            {index + 1}
          </div>
        </Popover>
      ))}

      {!!hashtags && (
        <Fragment>
          <div className="divider"></div>

          <div className="header">
            <h4>Hashtags</h4>
            <Icon
              type="copy"
              hover
              onClick={() => copyToClipboard(hashtags.join(" "))}
            />
          </div>
          <div>
            {hashtags ? (
              <div className="hashtag">{hashtags}</div>
            ) : (
              <div className="empty">No Tags</div>
            )}
          </div>
        </Fragment>
      )}

      <div className="divider"></div>
      <div className="flex center">
        <span className="mr">Visible</span>
        <Switch
          checked={visible}
          onChange={(value) => updateProperties({ visible: value })}
        />
      </div>
    </ControlsWrapper>
  );

  const PublishDates = (
    <ControlsWrapper>
      <div className="mb">
        Added:
        <span className="bold">{createdAtFormatted}</span>
        <br />
        <span>{createdTimeAgo}</span>
      </div>
      <div className="mb">
        Last Updated:
        <span className="bold">{updatedAtFormatted}</span>
        <br />
        <span>{updatedTimeAgo}</span>
      </div>
      {status === "POSTED" && (
        <div>
          Published: <span className="bold">{publishedOn}</span>
        </div>
      )}
    </ControlsWrapper>
  );

  const menuList = [
    {
      view: "LEFT",
      visible: !_.isEmpty(socialPlatformsList),
      component: SocialPlatforms,
      id: "SocialPlatforms",
    },
    {
      view: "LEFT",
      visible: false,
      component: SocialStatus,
      id: "SocialStatus",
    },
    {
      view: "LEFT",
      visible: true,
      component: Rating,
      id: "Rating",
    },
    {
      view: "LEFT",
      visible: true,
      component: Notes,
      id: "Notes",
    },
    {
      view: "LEFT",
      visible: type !== "CHAIN",
      component: Chain,
      id: "Chain",
    },
    {
      view: "RIGHT",
      visible: true,
      component: Status,
      id: "Status",
    },
    {
      view: "RIGHT",
      visible: true,
      component: Naming,
      id: "Naming",
    },
    {
      view: "RIGHT",
      visible: true,
      component: PublishDates,
      id: "PublishDates",
    },
  ];

  const CaptionModal = (
    <Modal
      title={"Social Plaform Captions"}
      centered={true}
      width={"50vw"}
      wrapClassName="react-ui caption-modal"
      visible={showCaptionModal}
      // visible={true}
      footer={null}
      onCancel={() => setShowCaptionModal(false)}
    >
      {_.isEmpty(socialPlatformsList) ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="social-platform-caption-container">
          {_.map(socialPlatformsList, ({ key, label, caption }) => (
            <div className="social-caption-item-wrapper">
              {editCaptionId === key ? (
                <TextArea
                  defaultValue={caption}
                  onBlur={(e) => {
                    const updatedCaptions = _.map(socialPlatformsList, (item) =>
                      item.key === editCaptionId
                        ? { ...item, caption: e.target.value }
                        : item
                    );
                    saveSettings({
                      data: { socialPlatforms: updatedCaptions },
                    });
                    setEditCaptionId(null);
                  }}
                />
              ) : (
                <Card
                  size="small"
                  title={label}
                  key={key}
                  extra={
                    <Icon
                      type="edit"
                      hover
                      size={12}
                      onClick={() => setEditCaptionId(key)}
                    />
                  }
                >
                  {caption ? (
                    <p onClick={() => copyToClipboard(caption)}>{caption}</p>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );

  return (
    <div className={`controls ${view}`}>
      {menuList
        .filter((item) => item.view.toLowerCase() === view && item.visible)
        .map((item) => (
          <Fragment key={item.id}>{item.component}</Fragment>
        ))}
      {CaptionModal}
    </div>
  );
};

const mapStateToProps = ({ settings }) => _.pick(settings, ["socialPlatforms"]);

export default connect(mapStateToProps, { saveSettings })(Controls);
