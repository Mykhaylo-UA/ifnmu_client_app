import React from "react"
import { Collapse, Timeline, Typography } from 'antd';

const { Panel } = Collapse;

const Instruction = () =>{
    return(
        <>
            <Typography.Title level={2} align="center">Інструкція</Typography.Title>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Розклад" key="1">
                    <Timeline>
                        <Timeline.Item>Введіть ваш курс</Timeline.Item>
                        <Timeline.Item>Введіть вашу групу</Timeline.Item>
                        <Timeline.Item>Натисніть синю кнопку</Timeline.Item>
                        <Timeline.Item>Дочекайтесь загрузки доступних тижнів</Timeline.Item>
                        <Timeline.Item>Виберіть тиждень</Timeline.Item>
                        <Timeline.Item>Дочекайтесь його загрузки</Timeline.Item>
                    </Timeline>
                    <Typography.Text keyboard>Натиснувши на дисципліну ви можете побачити доступні файли по даному предмету</Typography.Text>
                </Panel>
                {/*<Panel header="Додати/редагувати розклад" key="2">
                    <Timeline>
                        <Timeline.Item>Введіть ваш курс</Timeline.Item>
                        <Timeline.Item>Виберіть ваш факультет</Timeline.Item>
                        <Timeline.Item>Виберіть тип розкладу</Timeline.Item>
                        <Timeline.Item>В залежності від типу розкладу, виберіть тиждень</Timeline.Item>
                        <Timeline.Item>Натисніть синю кнопку</Timeline.Item>
                        <Timeline.Item>Заповніть або відредагуйте дані</Timeline.Item>
                    </Timeline>
                    <Typography.Text mark>Згодом добавлю відео-існтрукцію</Typography.Text>
                </Panel>
                <Panel header="Додати папку/файл" key="3">
                    <Timeline>
                        <Timeline.Item>Знайдіть або створіть нову папку з файлами для окремого предмета</Timeline.Item>
                        <Timeline.Item>Натиснувши на поле зі списка, вас перенаправить на сторінку додавання файлів</Timeline.Item>
                        <Timeline.Item>Виберіть файли які ви хочете додати</Timeline.Item>
                        <Timeline.Item>В залежності від типу розкладу, виберіть тиждень</Timeline.Item>
                        <Timeline.Item>Натисніть кнопку "Додати"</Timeline.Item>
                    </Timeline>
                    <Typography.Text keyboard>Не створюйте дві і більше папок для однієї дисципліни одного курсу, вони автоматично самознищаться</Typography.Text>
                </Panel>*/}
            </Collapse>
            <Typography.Title style={{marginTop: 30}} align="center" level={4}>Сайт знаходиться на стадії тестування і дорозробки. При виникненні питань, побажань, неполадок звертайтесь на 
            електронну пошту <Typography.Link type="email">mykhaylo1809@gmail.com</Typography.Link>
            </Typography.Title>
        </>
    )
}

export default Instruction