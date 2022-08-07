import React, {useEffect, useState} from 'react'
import Banner from '../../component/banner'
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container'

const TabComponent = ({history}) => {

  // Get Query Params by refresh
  const { search } = useLocation();
  const tabEventKey = new URLSearchParams(search).get('tabKey')

  // For tabs handle
  const [tabKey, setTabKey] = useState('home')
  const handleTabs = (key) => {
    setTabKey(key)
    const params = {
      tabKey: key
    }
    history.push({
      pathname: window.location.pathname,
      search: new URLSearchParams(params).toString()
    })
  }

  useEffect(() => {
    if (tabEventKey && tabEventKey.length) {
      setTabKey(tabEventKey)
    }
  }, []);

  return (
    <div>
        <Banner title="Corporate Tabs" description=" Lorem ipsum is placeholder text commonly used in the graphic."/>
        <Container>
            <h2 className="text-center mb-5">Tabs</h2>
            <div className='tab-wrapper'>
                <Tabs
                id="controlled-tab-example"
                activeKey={tabKey}
                onSelect={handleTabs}
                className="mb-3"
                >
                    <Tab eventKey="home" title="Home">
                        Home is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        Profile is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Tab>
                    <Tab eventKey="contact" title="Contact">
                        Contact is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Tab>
                </Tabs>
            </div>
      </Container>
    </div>
  )
}

export default TabComponent