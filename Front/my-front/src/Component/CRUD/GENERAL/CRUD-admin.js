import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDAdmin extends Component {
  render() {
    return (
      <div><CRUD entity="administration" idField="idAdmin" columns={['idAdmin','adminUsername','numEmployee']} /></div>
    )
  }
}
