import React, { useState } from "react"

import {Row, Input, Col, Form, Button, Tooltip, Select, List, Typography, message} from "antd"
import { SearchOutlined } from '@ant-design/icons';

import axios from "axios"

import {URL_API} from "../../GlobalVar"

import "./Home.css"
import {useHistory} from "react-router-dom"

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const getDayofWeek = number => {
    switch(number){
        case 1: return "Понеділок";
        case 2: return "Вівторок";
        case 3: return "Середа";
        case 4: return "Четвер";
        case 5: return "П'ятниця";
        case 6: return "Субота";
        case 0: return "Неділя";
        default: return ""
    }
}
const getTime = number =>{
    switch(number){
        case 1: return "08:00";
        case 2: return "10:05";
        case 3: return "12:10";
        case 4: return "14:15";
        default: return ""
    }
}

const Home = () =>{
    const history = useHistory();

    const pushTo = (location) => {
      history.push(location);
    }

    const [form] = Form.useForm();

    const [course, setCourse] = useState(1);
    const [group, setGroup] = useState("")

    const [loading, setLoading] = useState(false)

    const [weekLoadStatus, setWeekLoadStatus] = useState(false)
    const [weeks, setWeeks] = useState([])

    const [selectOption, setSelectOption] = useState(null)

    const [loadingLessons, setLoadingLesson] = useState(false)

    const [schedule, setSchedule] = useState(null)

    const courseChangeHandler = e =>{
        setCourse(e.target.value)

        setWeekLoadStatus(false)
        setSelectOption(null)
        setSchedule(null)
    }
    const groupChangeHandler = e =>{
        setGroup(e.target.value)

        setWeekLoadStatus(false)
        setSelectOption(null)
        setSchedule(null)
    }
    const selectChangeHandler = value =>{
        setLoadingLesson(true)
        setSelectOption(value)

        let str;

        if(value.length > 1){
            str="&startDate="+value;
        }
        else{
            str="&weekNumber="+value;
        }

        axios.get(URL_API+"/lesson/getLessons?course="+course+"&group="+group+str)
            .then(response =>{
                console.log(response.data)
                setLoadingLesson(false)
                setSchedule(response.data)
            })
            .catch(error =>{
                console.log(error.response)
                setLoadingLesson(false)
            })
    }

    const loadWeeks = () =>{
        if(isNaN(course) || course === "" || group === "") {
            
            message.error("Ви некоректно заповнили дані");
            return;
        }

        setLoading(true);

        axios.get(URL_API+"/lesson/getWeeks?course="+course+"&group="+group)
        .then(response => {
            console.log(response.data)

            let weekType=0;
            let w =[];
            if(response.data.length > 0){
                if(response.data[0].length > 1)
                {
                    weekType=1;
                }
                else{
                    weekType=2;
                }
            }
            response.data.map((option, index) =>{
                if(weekType===1){
                    let startDate = new Date(option);
                    let finishDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+4);

                    let select = <Select.Option key={index} value={option}>{startDate.toLocaleDateString('uk-UA', options) + " - " + finishDate.toLocaleDateString('uk-UA', options)}</Select.Option>;

                    w.push(select);
                }
                else{
                    let select = <Select.Option key={index} value={option}>{option==="1"? "Перший тиждень" : "Другий тиждень"}</Select.Option>;
                    w.push(select);
                }
            })
            setWeeks(w);

            setLoading(false)
            setWeekLoadStatus(true)
        })
        .catch(error=>{
            if(error.respones == null || error.response == undefined){
                message.error("Помилка")
            }
            else if(error.response.status === 404) {
                message.error("Даного розкладу не існує")
            }
            else{
                message.error("Помилка запиту")
            }

            console.log(error.response)

            setLoading(false)
            setWeekLoadStatus(false)
        })

    }

    return(
        <>
            <Row justify="center" gutter={[8, 16]}>
                    <Form
                        style={{margin:"15px 0"}}
                        layout={"inline"}
                        form={form}
                        style={{"justify-content":"center"}}
                    >
                        <Col md={weekLoadStatus === false ? 11 : 8} sm={12}>
                            <Form.Item >
                                <Input value={course} onChange={courseChangeHandler} placeholder="Курс" min={1} max={5} type={"number"} />
                            </Form.Item>
                        </Col>
                        <Col md={weekLoadStatus === false ? 11 : 8} sm={12}>
                        <Form.Item>
                            <Input value={group} onChange={groupChangeHandler} placeholder="Група" />
                        </Form.Item>
                        </Col>

                        <Col md={weekLoadStatus === false ? 2 : 12} sm={weekLoadStatus === false ? 2 : 16} xs={weekLoadStatus === false ? 2 : 20}>
                        {weekLoadStatus === false ?
                    
                            <Form.Item>
                                    <Tooltip title="search">
                                        <Button type="primary" onClick={loadWeeks} shape="circle" icon={<SearchOutlined />} loading={loading}/>
                                    </Tooltip>
                            </Form.Item>
                        :
                            <Form.Item>
                                <Select style={{width: "100%"}} placeholder={"Тиждень"} onChange={selectChangeHandler} value={selectOption} loading={loadingLessons}>
                                    {weeks.map(opt=> opt )}
                                </Select> 
                            </Form.Item>
                        }
                        </Col>
                    </Form>
            </Row>
            <Row justify="center">
                <Col xs={{span:24}} sm={20}>
                {schedule !== null ? schedule.weeks[0].days.map((option, index)=>{
                    return <List
                        key={index}
                        header={<div style={{textAlign : "center"}}><Typography.Text strong>{option.dayOfWeek === null ? new Date(option.dateTime).toDateString() : getDayofWeek(option.dayOfWeek)}</Typography.Text></div>}
                        bordered
                        dataSource={option.lessons}
                        renderItem={item => (
                            <List.Item className={"listItem"} style={{position:"relative"}} onClick={()=> pushTo("/files/"+course+"/"+item.name+"/"+schedule.faculty)}>
                                <Typography.Text style={{width: "82%"}} strong>{item.number}. {item.name}</Typography.Text>
                                <Typography.Text style={{width: "18%"}}>{getTime(item.number)}</Typography.Text>
                            </List.Item>
                        )}
                    />
                }):null}
                </Col>
            </Row> 
        </>
    )
}

export default Home;