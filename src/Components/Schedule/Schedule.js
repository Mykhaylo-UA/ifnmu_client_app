import React, { useState, useEffect } from 'react';
import "./Schedule.css"
import {Faculty, minMaxDate, URL_API} from "../../GlobalVar"

import { Form, Input, Button, Select, DatePicker, Row, Col, notification, Table, message } from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import axios from "axios"


const Schedule = () => {



    const [form] = Form.useForm();

    const [statusDays, setStatusDays] = useState(0)

    const [course, setCourse] = useState(1)
    const [typeSchedule, setTypeSchedule] = useState(0);
    const [faculty, setFaculty] = useState(0);
    const [numberWeek, setNumberWeek] = useState(1);
    const [startDate, setStartDate] = useState(null)
    const [errorDate, setErrorDate] = useState(false)

    const [nameLessons, setNameLessons] = useState([""])
    const [days, setDays] = useState([
        {dayofweek: 1, lessons: [
            [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
        },
        {dayofweek: 2, lessons: [
            [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
        },
        {dayofweek: 3, lessons: [
            [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
        },
        {dayofweek: 4, lessons: [
            [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
        },
        {dayofweek: 5, lessons: [
            [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
        }
    ])

    const [lectionInfo, setLectionInfo] = useState("")

    const [loadingSchedule, setLoadingSchedule] = useState(false)

    const [loadTable, setLoadTable] = useState(false);
    const [addStatus, setAddStatus] = useState(false)

    const [statusAddOrEdit, setStatusAddOrEdit] = useState(0)

    const courseChangeHandler = value=>{
        setLoadTable(false);
        if(value.target.value === "")
        {
            setCourse(1);
        }
        else setCourse(value.target.value)
    }
    const typeScheduleChangeHandler = value => {
        setLoadTable(false);
        setTypeSchedule(value)
    }
    const facultyChangeHandler = value => {
        setFaculty(value)
    }
    const numberWeekChangeHandler = value => {
        setLoadTable(false);
        setNumberWeek(value)
    }
    const startDateChangeHandler = (date, dateString) => {
        setLoadTable(false);
        if(date === null) return false;
        if(date._d < minMaxDate.min || date._d > minMaxDate.max)
        {
            notification.open({
                message: 'Дата',
                description:
                  "Тижні повинні входити в рамки "+minMaxDate.min.toLocaleDateString()+"-"+minMaxDate.max.toLocaleDateString(),
              });
            setErrorDate(true)
        }
        else{
            let day = date._d.getDay();

            if(day > 1){
                date._d.setDate(date._d.getDate() - (day - 1));
            }
            else if (day < 1){
                date._d.setDate(date._d.getDate() + 1);
            }
    
            setStartDate(date._d)
            setErrorDate(false)

            console.log(date._d)
        }
      }

    const clickLoadHandler=()=>{
        setLoadingSchedule(true)
        setLoadTable(false)

        if(typeSchedule === 1)
        {
        
            axios.get(URL_API+"/schedule/getShortSchedule/?course="+course+"&faculty="+faculty+"&numberWeek="+numberWeek).then(response=>{
                console.log(response)
                setLoadingSchedule(false)

                let data = response.data;
                console.log(data)

                setNameLessons(data.nameLessons);
                setDays(data.days)

                setStatusDays(3)
        
        
        })
            .catch(error=>{
            if(error.response == undefined) {
                message.error("Помилка сервера")
            
                return 
            }
            if(error.response.status === 404)
            {
                setStatusDays(2)
                setNameLessons([""])
                setDays([
                    {dayofweek: 1, lessons: [
                        [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
                    },
                    {dayofweek: 2, lessons: [
                        [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
                    },
                    {dayofweek: 3, lessons: [
                        [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
                    },
                    {dayofweek: 4, lessons: [
                        [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
                    },
                    {dayofweek: 5, lessons: [
                        [{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}]]
                    }
                ])
                
            }
            else{
                message.error(error.response.message)
            }

        })
        }
        else{
            axios.get(URL_API+"/schedule/getFullSchedule/?course="+course+"&faculty="+faculty+"&startDate="+startDate.toLocaleDateString()).then(response=>{
                console.log(response)
                setLoadingSchedule(false)

                let data = response.data;
                console.log(data)

                setNameLessons(data.nameLessons);
                setDays(data.days)

                setStatusDays(4)
        
        
        })
            .catch(error=>{
            if(error.response.status === 404)
            {
                let dates=[
                    new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()),
                    new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+1),
                    new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+2),
                    new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+3),
                    new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+4),
                ]

                setStatusDays(1)
                setNameLessons(()=>[""])
                setDays(prev=>[
                    {datetime: dates[0].getFullYear()+"-"+(dates[0].getMonth() < 10? "0"+(dates[0].getMonth()+1): dates[0].getMonth()+1)+"-"+(dates[0].getDate() < 10 ? "0"+dates[0].getDate(): dates[0].getDate()), lessons: [
                        [{string:"", number:1},{string:"", number:3}]]
                    },
                    {datetime: dates[1].getFullYear()+"-"+(dates[0].getMonth() < 10? "0"+(dates[0].getMonth()+1): dates[0].getMonth()+1)+"-"+(dates[1].getDate() < 10 ? "0"+dates[1].getDate(): dates[1].getDate()), lessons: [
                        [{string:"", number:1},{string:"", number:3}]]
                    },
                    {datetime: dates[2].getFullYear()+"-"+(dates[0].getMonth() < 10? "0"+(dates[0].getMonth()+1): dates[0].getMonth()+1)+"-"+(dates[2].getDate() < 10 ? "0"+dates[2].getDate(): dates[2].getDate()), lessons: [
                        [{string:"", number:1},{string:"", number:3}]]
                    },
                    {datetime: dates[3].getFullYear()+"-"+(dates[0].getMonth() < 10? "0"+(dates[0].getMonth()+1): dates[0].getMonth()+1)+"-"+(dates[3].getDate() < 10 ? "0"+dates[3].getDate(): dates[3].getDate()), lessons: [
                        [{string:"", number:1},{string:"", number:3}]]
                    },
                    {datetime: dates[4].getFullYear()+"-"+(dates[0].getMonth() < 10? "0"+(dates[0].getMonth()+1): dates[0].getMonth()+1)+"-"+(dates[4].getDate() < 10 ? "0"+dates[4].getDate(): dates[4].getDate()), lessons: [
                        [{string:"", number:1},{string:"", number:3}]]
                    }
                ])
                
            }
            else{
                message.error(error.response.message)
            }

        })
        }
    }

    const nameLessonsChangeHandler = (value, index)=>{
        let s = nameLessons.slice();

        s[index] = value.target.value;

        setNameLessons(s)
    }

    const addRowHandler = ()=>{
        setNameLessons(nameLessons.concat(""))

        let d = [...days];

        for(let a=0; a< 5; a++){
            if(typeSchedule === 1) d[a].lessons.push([{string:"", number:1},{string:"", number:2},{string:"", number:3},{string:"", number:4}])
            else d[a].lessons.push([{string:"", number:1},{string:"", number:3}])
        }

        setDays(d)

        if(typeSchedule === 1) setData(data.concat({
            key: nameLessons.length+1,
            name: <Input placeholder={1} style={{margin: 0}} onBlur={e=>nameLessonsChangeHandler(e, nameLessons.length)}/>,
            11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, nameLessons.length+1, 1)}/>,
          12: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, nameLessons.length+1, 2)}/>,
          13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, nameLessons.length+1, 3)}/>,
          14: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, nameLessons.length+1, 4)}/>,
          21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, nameLessons.length+1, 1)}/>,
          22: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, nameLessons.length+1, 2)}/>,
          23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, nameLessons.length+1, 3)}/>,
          24: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, nameLessons.length+1, 4)}/>,
          31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, nameLessons.length+1, 1)}/>,
          32: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, nameLessons.length+1, 2)}/>,
          33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, nameLessons.length+1, 3)}/>,
          34: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, nameLessons.length+1, 4)}/>,
          41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, nameLessons.length+1, 1)}/>,
          42: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, nameLessons.length+1, 2)}/>,
          43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, nameLessons.length+1, 3)}/>,
          44: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, nameLessons.length+1, 4)}/>,
          51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, nameLessons.length+1, 1)}/>,
          52: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, nameLessons.length+1, 2)}/>,
          53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, nameLessons.length+1, 3)}/>,
          54: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, nameLessons.length+1, 4)}/>
          }))
          else setData(data.concat({
            key: nameLessons.length+1,
            name: <Input placeholder={1} style={{margin: 0}} onBlur={e=>nameLessonsChangeHandler(e, nameLessons.length)}/>,
            11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, nameLessons.length+1, 1)}/>,
          13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, nameLessons.length+1, 2)}/>,
          
          21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, nameLessons.length+1, 1)}/>,
          23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, nameLessons.length+1, 2)}/>,
         
          31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, nameLessons.length+1, 1)}/>,
          33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, nameLessons.length+1, 2)}/>,
          
          41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, nameLessons.length+1, 1)}/>,
          43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, nameLessons.length+1, 2)}/>,
          
          51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, nameLessons.length+1, 1)}/>,
          53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, nameLessons.length+1, 2)}/>,
          
          }))
    }

    const inputChangeHandler = (e, dayOfWeek, numberName, numberLesson) =>{
        let d = [...days]

        d[dayOfWeek-1].lessons[numberName-1][numberLesson-1].string = e.target.value;

        setDays(d);

        console.log("days change", days)
    }

    const [data, setData] = useState([
        {
          key: 1,
          name: <Input placeholder={1} onBlur={e=>nameLessonsChangeHandler(e, 0)}/>,
          11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 1)}/>,
          12: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 2)}/>,
          13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 3)}/>,
          14: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 4)}/>,
          21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 1)}/>,
          22: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 2)}/>,
          23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 3)}/>,
          24: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 4)}/>,
          31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 1)}/>,
          32: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 2)}/>,
          33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 3)}/>,
          34: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 4)}/>,
          41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 1)}/>,
          42: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 2)}/>,
          43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 3)}/>,
          44: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 4)}/>,
          51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 1)}/>,
          52: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 2)}/>,
          53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 3)}/>,
          54: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 4)}/>
        },
      ]);



    const addSchedule =() =>{
        for(let a=0; a< nameLessons.length; a++){
            if(nameLessons[a]==""){
                message.error("Пусте значення поля | індекс "+a)
                return
            }
        }

        const hide = message.loading('Додаємо розклад', 0);
        setAddStatus(true)

        if(typeSchedule===1)
        {
            axios.post(URL_API+"/schedule/addShortSchedule/?course="+course+"&faculty="+faculty+"&numberWeek="+numberWeek+"&lectionInfo="+lectionInfo, {"nameLessons": nameLessons, "days": days}).then(response=>{
                hide();
                message.success("Розклад додано успішно")
                setAddStatus(false)
                setStatusAddOrEdit(1)
                
            }).catch(error=> {
                setAddStatus(false)
                message.error(error.response.message)
            })
        }
        else{
            axios.post(URL_API+"/schedule/addFullSchedule/?course="+course+"&faculty="+faculty+"&lectionInfo="+lectionInfo, {"nameLessons": nameLessons, "days": days}).then(response=>{
                hide();
                message.success("Розклад додано успішно")
                setAddStatus(false)
                setStatusAddOrEdit(1)
                
            }).catch(error=> {
                setAddStatus(false)
                message.error(error.response.message)
            })
        }
    }

    const editSchedule = () =>{
        const hide = message.loading('Змінюємо розклад', 0);
        setAddStatus(true)

        if(typeSchedule===1)
        {
            axios.put(URL_API+"/schedule/editShortSchedule/?course="+course+"&faculty="+faculty+"&numberWeek="+numberWeek+"&lectionInfo="+lectionInfo, {"nameLessons": nameLessons, "days": days}).then(response=>{
                hide();
                message.success("Розклад змінено успішно")
                setAddStatus(false)
                
            }).catch(error=> {
                setAddStatus(false)
                message.error(error.response.message)
            })
        }
        else{
            axios.put(URL_API+"/schedule/editFullSchedule/?course="+course+"&faculty="+faculty+"&lectionInfo="+lectionInfo+"&startDate="+startDate.toLocaleDateString(), {"nameLessons": nameLessons, "days": days}).then(response=>{
                hide();
                message.success("Розклад змінено успішно")
                setAddStatus(false)
                
            }).catch(error=> {
                setAddStatus(false)
                message.error(error.response.message)
            })
        }
    }

    useEffect(()=>{
        if(statusDays===1){
            setData([{
                key: 1,
                name: <Input placeholder={1} onBlur={e=>nameLessonsChangeHandler(e, 0)}/>,
                11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 1)}/>,
                13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 2)}/>,
                21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 1)}/>,
                23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 2)}/>,
                31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 1)}/>,
                33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 2)}/>,
                41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 1)}/>,
                43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 2)}/>,
                51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 1)}/>,
                53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 2)}/>,
                
              }])

            setStatusAddOrEdit(0)

            setLoadTable(true)

            message.info("Даного розкладу не існує, потрібно створити новий")

            setLoadingSchedule(false)

            setStatusDays(0)
            
        }
        else if(statusDays === 2){
            setData([{
                key: 1,
                name: <Input placeholder={1} onBlur={e=>nameLessonsChangeHandler(e, 0)}/>,
                11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 1)}/>,
                12: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 2)}/>,
                13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 3)}/>,
                14: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, 1, 4)}/>,
                21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 1)}/>,
                22: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 2)}/>,
                23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 3)}/>,
                24: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, 1, 4)}/>,
                31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 1)}/>,
                32: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 2)}/>,
                33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 3)}/>,
                34: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, 1, 4)}/>,
                41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 1)}/>,
                42: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 2)}/>,
                43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 3)}/>,
                44: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, 1, 4)}/>,
                51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 1)}/>,
                52: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 2)}/>,
                53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 3)}/>,
                54: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, 1, 4)}/>
              }])

            setStatusAddOrEdit(0)

            setLoadTable(true)

            message.info("Даного розкладу не існує, потрібно створити новий")

            setLoadingSchedule(false)

            setStatusDays(0)
        }
        else if(statusDays === 3){
            let newTableData = [];

            for(let o=0; o < nameLessons.length; o++){
                newTableData = newTableData.concat({
                    key: o,
                    name: <Input placeholder={1} style={{margin: 0}} onBlur={e=>nameLessonsChangeHandler(e, o)} defaultValue={nameLessons[o]}/>,
                    11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, o+1, 1)} defaultValue={days[0].lessons[o][0].string}/>,
                    12: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, o+1, 2)} defaultValue={days[0].lessons[o][1].string}/>,
                    13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, o+1, 3)} defaultValue={days[0].lessons[o][2].string}/>,
                    14: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, o+1, 4)} defaultValue={days[0].lessons[o][3].string}/>,
                    21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, o+1, 1)} defaultValue={days[1].lessons[o][0].string}/>,
                    22: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, o+1, 2)} defaultValue={days[1].lessons[o][1].string}/>,
                    23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, o+1, 3)} defaultValue={days[1].lessons[o][2].string}/>,
                    24: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, o+1, 4)} defaultValue={days[1].lessons[o][3].string}/>,
                    31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, o+1, 1)} defaultValue={days[2].lessons[o][0].string}/>,
                    32: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, o+1, 2)} defaultValue={days[2].lessons[o][1].string}/>,
                    33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, o+1, 3)} defaultValue={days[2].lessons[o][2].string}/>,
                    34: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, o+1, 4)} defaultValue={days[2].lessons[o][3].string}/>,
                    41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, o+1, 1)} defaultValue={days[3].lessons[o][0].string}/>,
                    42: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, o+1, 2)} defaultValue={days[3].lessons[o][1].string}/>,
                    43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, o+1, 3)} defaultValue={days[3].lessons[o][2].string}/>,
                    44: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, o+1, 4)} defaultValue={days[3].lessons[o][3].string}/>,
                    51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, o+1, 1)} defaultValue={days[4].lessons[o][0].string}/>,
                    52: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, o+1, 2)} defaultValue={days[4].lessons[o][1].string}/>,
                    53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, o+1, 3)} defaultValue={days[4].lessons[o][2].string}/>,
                    54: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, o+1, 4)} defaultValue={days[4].lessons[o][3].string}/>
                })
            }

            setStatusAddOrEdit(1)
            
            setData(newTableData)

            setLoadTable(true)
        }
        else if(statusDays===4){
            let newTableData = [];

            for(let o=0; o < nameLessons.length; o++){
                newTableData = newTableData.concat({
                    key: o,
                    name: <Input placeholder={1} style={{margin: 0}} onBlur={e=>nameLessonsChangeHandler(e, o)} defaultValue={nameLessons[o]}/>,
                    11: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, o+1, 1)} defaultValue={days[0].lessons[o][0].string}/>,
                    13: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 1, o+1, 2)} defaultValue={days[0].lessons[o][1].string}/>,
                    21: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, o+1, 1)} defaultValue={days[1].lessons[o][0].string}/>,
                    23: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 2, o+1, 2)} defaultValue={days[1].lessons[o][1].string}/>,
                    31: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, o+1, 1)} defaultValue={days[2].lessons[o][0].string}/>,
                    33: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 3, o+1, 2)} defaultValue={days[2].lessons[o][1].string}/>,
                    41: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, o+1, 1)} defaultValue={days[3].lessons[o][0].string}/>,
                    43: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 4, o+1, 2)} defaultValue={days[3].lessons[o][1].string}/>,
                    51: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, o+1, 1)} defaultValue={days[4].lessons[o][0].string}/>,
                    53: <Input placeholder={1} onBlur={e=>inputChangeHandler(e, 5, o+1, 2)} defaultValue={days[4].lessons[o][1].string}/>
                })
            }
            
            setData(newTableData)

            setStatusAddOrEdit(1)

            setLoadTable(true)
        }
    }, [days]) // eslint-disable-next-line

    return (
        <>
            <Row justify="center" align="middle">
                <Col>
                    <Form
                        style={{margin:"15px 0", display:"flex", "justify-content":"center", "text-align":"center"}}
                        layout={"inline"}
                        form={form}
                    >
                        <Form.Item className="input-width">
                            <Input value={course} onChange={courseChangeHandler} placeholder="Курс" min={1} max={5} type={"number"} />
                        </Form.Item>
                        <Form.Item className="input-width">
                            <Select defaultValue={faculty} onChange={facultyChangeHandler} placeholder={"Факультет"}>
                                <Select.Option value={Faculty.Medicine}>Медицина</Select.Option>
                                <Select.Option value={Faculty.ShortMedicine}>Медицина скорочена</Select.Option>
                                <Select.Option value={Faculty.Paramedic}>Фельдшера</Select.Option>
                                <Select.Option value={Faculty.Nurse}>Сестринська справа</Select.Option>
                                <Select.Option value={Faculty.Pediatric}>Педіатрія</Select.Option>
                                <Select.Option value={Faculty.Stomatology}>Стоматологі</Select.Option>
                                <Select.Option value={Faculty.Ortopedic}>Зубні техніки</Select.Option>
                                <Select.Option value={Faculty.Ortopedic11}>Зубні техніки (після 11)</Select.Option>
                                <Select.Option value={Faculty.Farmacy}>Фармація</Select.Option>
                                <Select.Option value={Faculty.Farmacy11}>Фармація (після 11 коледж)</Select.Option>
                                <Select.Option value={Faculty.Farmacy9}>Фармація (після 9 коледж)</Select.Option>
                                <Select.Option value={Faculty.Reabilitology}>Реабілітологія</Select.Option>
                                <Select.Option value={Faculty.Foreigners}>Іноземці</Select.Option>
                                <Select.Option value={Faculty.ShortStomatology}>Скорочена стоматологія</Select.Option>
                                <Select.Option value={Faculty.ShortFarmacy}>Скорочена фармація</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item className="input-width">
                            <Select defaultValue={typeSchedule} onChange={typeScheduleChangeHandler} placeholder={"Тип розкладу"}>
                                <Select.Option value={0}>Цілий семестр</Select.Option>
                                <Select.Option value={1}>1/2 тиждень</Select.Option>
                            </Select>
                        </Form.Item>
                        {typeSchedule===1 ? 
                            <Form.Item className="input-width">
                                <Select defaultValue={numberWeek} onChange={numberWeekChangeHandler} placeholder={"Номер тижня"}>
                                    <Select.Option value={1}>Перший тиждень</Select.Option>
                                    <Select.Option value={2}>Другий тиждень</Select.Option>
                                </Select>
                            </Form.Item> 
                        :
                            <Form.Item className="input-width" max={minMaxDate.max}>
                                    <DatePicker className={"input-width " + (errorDate?"error-field": "")} onChange={startDateChangeHandler} picker="week"/>
                            </Form.Item> 
                        }
                    
                        <Form.Item>
                            <Button type="primary" onClick={clickLoadHandler} loading={loadingSchedule}>Загрузити</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            {loadTable === true ?
            <Row justify="center">
                <Col>
                    <Table pagination={false} bordered dataSource={data} style={{minWidth: 1000}} 
                    className={'customTable'}
                    footer={()=>(<React.Fragment>
                        <Row><Input placeholder="Потоки" value={lectionInfo} onChange={e=>setLectionInfo(e.target.value)} /></Row>
                        <Row>
                            <Col><Button onClick={addRowHandler}>Add row</Button></Col>
                            <Col>{statusAddOrEdit===0 ? 
                                <Button onClick={addSchedule} loading={addStatus}>Add schedule</Button>:
                                <Button onClick={editSchedule} loading={addStatus}>Edit schedule</Button>
                            }</Col>
                        </Row>
                    </React.Fragment>)}
                    >

                        <Column title="Назва дисципліни" dataIndex="name" key="name" />
                        {loadTable === true ?
                            typeSchedule === 1 ?
                                <>
                                    <ColumnGroup title="Понеділок">
                                        <Column title="1" dataIndex="11" key="11" />
                                        <Column title="2" dataIndex="12" key="12" />
                                        <Column title="3" dataIndex="13" key="13" />
                                        <Column title="4" dataIndex="14" key="14" />
                                    </ColumnGroup>
                                    <ColumnGroup title="Вівторок">
                                        <Column title="1" dataIndex="21" key="21" />
                                        <Column title="2" dataIndex="22" key="22" />
                                        <Column title="3" dataIndex="23" key="23" />
                                        <Column title="4" dataIndex="24" key="24" />
                                    </ColumnGroup>
                                    <ColumnGroup title="Середа">
                                        <Column title="1" dataIndex="31" key="21" />
                                        <Column title="2" dataIndex="32" key="32" />
                                        <Column title="3" dataIndex="33" key="33" />
                                        <Column title="4" dataIndex="34" key="34" />
                                    </ColumnGroup>
                                    <ColumnGroup title="Четвер">
                                        <Column title="1" dataIndex="41" key="41" />
                                        <Column title="2" dataIndex="42" key="42" />
                                        <Column title="3" dataIndex="43" key="43" />
                                        <Column title="4" dataIndex="44" key="44" />
                                    </ColumnGroup>
                                    <ColumnGroup title="П'ятниця">
                                        <Column title="1" dataIndex="51" key="51" />
                                        <Column title="2" dataIndex="52" key="52" />
                                        <Column title="3" dataIndex="53" key="53" />
                                        <Column title="4" dataIndex="54" key="54" />
                                    </ColumnGroup>
                                </>
                            : 
                            <>
                            {console.log("table days", days)}
                                    <ColumnGroup title={new Date (startDate).toDateString()}>
                                        <Column title="1-2" dataIndex="11" key="11" />
                                        <Column title="3-4" dataIndex="13" key="13" />
                                    </ColumnGroup>
                                    <ColumnGroup title={new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+1).toDateString()}>
                                        <Column title="1-2" dataIndex="21" key="21" />
                                        <Column title="3-4" dataIndex="23" key="23" />
                                    </ColumnGroup>
                                    <ColumnGroup title={new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+2).toDateString()}>
                                        <Column title="1-2" dataIndex="31" key="31" />
                                        <Column title="3-4" dataIndex="33" key="33" />
                                    </ColumnGroup>
                                    <ColumnGroup title={new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+3).toDateString()}>
                                        <Column title="1-2" dataIndex="41" key="41" />
                                        <Column title="3-4" dataIndex="43" key="43" />
                                    </ColumnGroup>
                                    <ColumnGroup title={new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate()+4).toDateString()}>
                                        <Column title="1-2" dataIndex="51" key="51" />
                                        <Column title="3-4" dataIndex="53" key="53" />
                                    </ColumnGroup>
                            </>: null
                            }
                    </Table>
                </Col>
            </Row> 
            : null}
        </>
    )
}

export default Schedule