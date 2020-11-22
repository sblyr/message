import React from "react";
import { css } from "emotion";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import api from "./api";
import ModelDetailPage from "@sublayer/ui/lib/model-detail-page";
import Loader from "@sublayer/ui/lib/loader";
import Content from "./Content";
import icons from './icons2'
import hooks from './hooks'

class TableRoute extends React.Component {
    state = {
        data: null,
        loaded: null,
        loading: true
    };

    componentDidMount() {
        this.fetch();
    }

    async componentDidUpdate(prevProps) {
        if (
            prevProps.modelId !== this.props.modelId ||
            prevProps.recordId !== this.props.recordId
        ) {
            await this.fetch();
        }
    }

    fetch = async () => {
        this.setState({
            loading: true
        });
        const { modelId, recordId } = this.props.match.params;

        const response = await api.request({
            url: `/record/${modelId}/${recordId}`,
            method: "get"
        });

        this.setState({
            data: response.data.data,
            loaded: modelId + recordId,
            loading: false
        });
    };

    isLoading = () =>
        this.state.loading ||
        this.state.loaded !== this.props.modelId + this.props.recordId;

    handleRequest = async params => {
        console.log('handleRequest', params)

        const response = await api.request({
            method: "post",
            url: "/component/has-many",
            data: {
                componentId: params.id,
                modelId: params.modelId,
                recordId: params.recordId,
            }
        })

        console.log(response)

        return response
    }

    render() {
        if (this.isLoading()) {
            return <Loader />;
        }

        const { data } = this.state;
        const schema = this.props.state.toJS()

        const { modelId, recordId } = this.props
        const model = schema.ModelDatas[modelId]
        const record = data[modelId + 'Datas'][recordId]
        const title = record[model.primaryField || 'id']
        console.log("data", data);

        return (
            <div
                className={css`
                    padding-top: 70px;
                `}
            >
                <Content>
                    <div className={"container-fluid"}>
                        <div className={"row"}>
                            <ModelDetailPage
                                components={{
                                    ComingSoon: () => (
                                        <div>
                                            coming soon
                                        </div>
                                    )
                                }}
                                modelDetailPage={this.props.modelDetailPage.toJS()}
                                schema={schema}
                                data={this.state.data}
                                hooks={hooks}
                                modelId={this.props.modelId}
                                recordId={this.props.recordId}
                                onRequest={this.handleRequest}
                            />
                        </div>
                    </div>
                </Content>
                <div
                    className={css`
                    position: fixed;
                    top: 0;
                    left: 250px;
                    right: 0;
            height: 70px;
            border-bottom: 1px solid #ebebeb;
            background-color: #fff;
          `}
                >
                    <div
                        className={css`
              padding: 0 30px;
            `}
                    >
                        <div
                            className={css`
                font-size: 26px;
                display: flex;
                align-items: center;
                height: 70px;
              `}
                        >
                            <div>
                                <Link
                                    className={css`
                    color: #b3b3b3;
                    text-decoration: none;
                    cursor: pointer;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    transition: 200ms ease color;
                    &:hover {
                        color: #000;
                    }
                  `}
                                    to={`/explorer/${this.props.modelId}`}
                                >
                                    <div
                                        className={css`
                                            background-color: rgb(var(--primaryColor));
                                            color: #fff;
                                            width: 34px;
                                            height: 34px;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            border-radius: 6px;
                                            margin-right: 16px;
                                        `}
                                    >
                                        {icons.list({ height: 18 })}
                                    </div>
                                    {this.props.model.get("plural")}
                                </Link>
                            </div>
                            <div
                                className={css`
                  display: flex;
                  margin-left: 12px;
                  margin-right: 12px;
                  color: #b3b3b3;
                `}
                            >
                                /
                            </div>
                            <div>{title ? title : 'Untitled'}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state, props) => {
    return {
        state,
        modelId: props.match.params.modelId,
        recordId: props.match.params.recordId,
        model: state.getIn(["ModelDatas", props.match.params.modelId]),
        modelDetailPage: state.getIn([
            "ModelDetailPageDatas",
            props.match.params.modelId
        ])
    };
})(TableRoute);
