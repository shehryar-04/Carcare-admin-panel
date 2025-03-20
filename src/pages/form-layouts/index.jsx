// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, Container, Button } from 'reactstrap'

// ** Demo Components
import HorizontalForm from './HorizontalForm'
import HorizontalFormIcons from './HorizontalFormIcons'
import NotificationForm from './NotificationForm'
import CreateProductForm from './CreateProductForm'
import CreateFaq from './CreateFaq'

const FormLayouts = () => {
  const [selectedForm, setSelectedForm] = useState('')

  const renderForm = () => {
    switch (selectedForm) {
      case 'horizontal':
        return <HorizontalForm />
      case 'horizontalIcons':
        return <HorizontalFormIcons />
      case 'notification':
        return <NotificationForm />
      case 'product':
        return <CreateProductForm />
      case 'faq':
        return <CreateFaq />
      default:
        return <p className='text-center mt-3'>Please select a form</p>
    }
  }

  return (
    <Fragment>
      <Container className='mt-3'>
        <Row className='mb-3'>
          <Col className='d-flex justify-content-center'>
            <Button color='primary' className='me-2' onClick={() => setSelectedForm('horizontal')}>Service</Button>
            <Button color='primary' className='me-2' onClick={() => setSelectedForm('horizontalIcons')}>Area, Banner, Blog, or Category</Button>
            <Button color='primary' className='me-2' onClick={() => setSelectedForm('notification')}>Notification </Button>
            <Button color='primary' className='me-2' onClick={() => setSelectedForm('product')}>Product </Button>
            <Button color='primary' onClick={() => setSelectedForm('faq')}>FAQ</Button>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <Card>
              <CardBody>{renderForm()}</CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}
export default FormLayouts
