import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import icons from './icons2'
import { Container, Sidebar, MenuBrand, MenuContainer, Menu, MenuSeparator, MenuItem } from '@sublayer/ui/lib/sidebar'
import signout from '@sublayer/passport-components/lib/signout'
class ModelListPageNavItem extends React.Component {

    render() {

        if (!this.props.model) {
            return <MenuItem
                {...this.props}
                icon={icons.list}
                title={`Model "${this.props.modelId}" not found`}
            />
        }

        const iconKey = this.props.model.get("icon");
        const url = `/explorer/${this.props.modelId}`;

        const icon = icons[iconKey] ? icons[iconKey] : icons.list

        return (
            <MenuItem
                {...this.props}
                title={this.props.model.get("plural")}
                icon={icon}
                active={this.props.history.location.pathname.indexOf(url) !== -1}
                onClick={() => this.props.history.push(url)}
            />
        );
    }
}

ModelListPageNavItem = withRouter(ModelListPageNavItem);

ModelListPageNavItem = connect((state, props) => {
    return {
        model: state.getIn(["ModelDatas", props.modelId])
    };
})(ModelListPageNavItem);

const navItemTypes = {
    ModelListPage: ModelListPageNavItem
};
class Layout extends React.Component {

    render() {

        const theme = 'dark'

        return (
            <div>
                <Container>
                    <Sidebar theme={theme}>
                        <MenuBrand
                            theme={theme}
                            imageFitTypeId={'cover'}
                            imageUrl={window._env_.REACT_APP_BRAND_IMAGE_URL}
                            title={window._env_.REACT_APP_TITLE}
                            description={window._env_.REACT_APP_VERSION}
                            />
                        <MenuContainer>
                            <Menu>
                                {this.props.navItems.toJS().map((navItem, index) => {
                                    const Component = navItemTypes[navItem.type];

                                    return <Component key={index} theme={theme} {...navItem} />;
                                })}
                                <MenuSeparator large={true} theme={theme} />
                                <MenuItem
                                    theme={theme}
                                    icon={icons.signout}
                                    small={true}
                                    title={'Sign out'}
                                    onClick={signout}
                                />
                            </Menu>
                        </MenuContainer>
                    </Sidebar>
                    {this.props.children}
                </Container>
            </div>
        )
    }
}

export default withRouter(connect((state, props) => {

    return {
        navItems: state.get('NavItem').map(id => state.getIn(['NavItemDatas', id]))
    }
})(Layout))