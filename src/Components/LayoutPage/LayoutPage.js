import React, {useState, useEffect} from "react"
import './LayoutPage.css';

import { Layout, Menu, Affix, Drawer} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TranslationOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

import {useHistory, useLocation} from "react-router-dom"

import {CSSTransition} from "react-transition-group"

const { Header, Content, Footer, Sider } = Layout;

const LayoutPage = props => {
    const location = useLocation();
    const history = useHistory();

    const pushTo = (location) => {
      history.push(location);
    }

    const [collapsed, setCollapsed]= useState(true);
    const [colWidth, setColWidth] = useState(0)

    const onCollapse = collapsed => setCollapsed(collapsed)
    const onClose = () => {
        setCollapsed(true)
      };
    

    const onBreakpoint = broken =>{
        if(broken) setColWidth(0);
        else setColWidth(80);
        console.log(broken)

    }

    return (
        <Layout style={{ minHeight: '100vh', overflowX: (colWidth === 0 ? collapsed ? "auto" : "hidden" : "auto") }}>
            {colWidth == 0 ?<CSSTransition in={collapsed} timeout={300} classNames="mask">
                <div onClick={onClose} className={"mask"}></div>
            </CSSTransition>
            : null }
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} breakpoint="md" onBreakpoint={onBreakpoint} collapsedWidth={colWidth}
            >
                {/*<div className="logo" />*/}
                    <Menu style={{position: "", top: 0, width: collapsed?colWidth : 200}} theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline" mask={true}>
                        <Menu.Item key="/" icon={<PieChartOutlined />} onClick={()=>pushTo("/")}>
                            Розклад
                        </Menu.Item>
                        {/*<Menu.Item key="/schedule" icon={<DesktopOutlined />} onClick={()=>pushTo("/schedule")}>
                            Додати розклад
                        </Menu.Item>
                        <Menu.Item key="/directories" icon={<FileOutlined />} onClick={()=>pushTo("/directories")}>
                            Додати папку/файл
        </Menu.Item>*/}
                        <Menu.Item key="/instruction" icon={<TranslationOutlined />} onClick={()=>pushTo("/instruction")}>
                            Інструкція
                        </Menu.Item>
                    </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, height: 42, width: "100%"}} >
                    {/*<div className="logo" />*/}
                </Header>
                <Content style={{ margin: '5px 5px', minWidth: "310px"}}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 100 }}>
                        {props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>B M Y ©2020</Footer>
            </Layout>
        </Layout>
    );
}

export default LayoutPage;
