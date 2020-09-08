import React from "react";
import { css } from "emotion";
import { connect } from "react-redux";
import api from "./api";
import Table from '@sublayer/ui/lib/table'
import Loader from '@sublayer/ui/lib/loader'
// import '@sublayer/ui/lib/table/index.css'
import './Table.css'
import icons from './icons2'

const noop = () => { }

class TableRoute extends React.Component {

    state = {
        data: null,
        loading: true,
        loaded: null
    };

    componentDidMount() {
        console.log('TableRoute!', this.props)
        this.fetch();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.modelId !== this.props.modelId) {
            await this.fetch();
        }
    }

    fetch = async () => {
        this.setState({
            loading: true
        });
        const response = await api.request({
            method: "get",
            url: `/records/${this.props.match.params.modelId}`
        });

        this.setState({
            data: response.data.data,
            loading: false,
            loaded: this.props.modelId
        });
    };

    render() {
        return (
            <div>
                <div
                    className={css`
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
                                <div
                                    className={css`
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={css`
                    position: relative;
            width: 100%;
            height: calc(100vh - 70px);
            background-color: #fff;
          `}
                >
                    {this.state.loaded === this.props.modelId ? (
                        <Table
                            modelId={this.props.modelId}
                            schema={this.props.state.toJS()}
                            data={this.state.data}
                            onPageRefresh={noop}
                            onRecordClick={this.handleRecordClick}
                        />
                    ) : (
                            <Loader />
                        )}
                </div>
            </div>
        );
    }

    handleRecordClick = ({ recordId }) => {
        this.props.history.push(`/explorer/${this.props.model.get("id")}/${recordId}`);
    };
}

export default connect((state, props) => {
    return {
        state,
        modelId: props.match.params.modelId,
        model: state.getIn(["ModelDatas", props.match.params.modelId])
    };
})(TableRoute);
