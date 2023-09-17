import React, { Component } from 'react';

class SelectionBox extends Component {
  handleItemSelect = (rowData) => {
    const { selectedItems } = this.props;
    const newSelectedItems = new Set(selectedItems);

    if (newSelectedItems.has(rowData[this.props.idField])) {
      newSelectedItems.delete(rowData[this.props.idField]);
    } else {
      newSelectedItems.add(rowData[this.props.idField]);
    }

    this.props.updateSelectedItems(newSelectedItems);
  };

  handleSelectAll = () => {
    const { selectedItems, data, selectAll, searchQuery } = this.props;

    if (selectAll) {
      this.props.updateSelectedItems(new Set());
    } else {
      const filteredData = data.filter((rowData) =>
        Object.values(rowData).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      const allItemIds = filteredData.map((item) => item[this.props.idField]);
      this.props.updateSelectedItems(new Set(allItemIds));
    }
  };

  render() {
    const { selectedItems, itemId } = this.props;

    return (
      <td>
        <input
          type="checkbox"
          checked={selectedItems.has(itemId)}
          onChange={() => this.handleItemSelect(itemId)}
        />
        {/* Add a select all checkbox here */}
        <input
          type="checkbox"
          checked={this.props.selectAll}
          onChange={this.handleSelectAll}
          className="select-all-checkbox"
        />
      </td>
    );
  }
}

export default SelectionBox;
