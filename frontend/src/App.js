import React, { Component } from "react";
import {
  ReactiveBase,
  DataSearch,
  ResultList,
  MultiList,
  ReactiveList,
  RangeSlider,
} from "@appbaseio/reactivesearch";
import "./App.css";

const {
  REACT_APP_ELASTICSEARCH_SERVER: elasticsearchServer,
  REACT_APP_ELASTICSEARCH_INDEX: elasticsearchIndex,
} = process.env;

class App extends Component {
  onData(record) {
    return (
      <ReactiveList.ResultListWrapper>
        <ResultList key={record._id}>
          <ResultList.Content>
            <ResultList.Title>{record.name}</ResultList.Title>
            <ResultList.Description>
              <div>
                <p>{record.contributor}</p>
                <p>{record.political_party}</p>
                <p>{record.total_amount}</p>
                <p>{record.year}</p>
              </div>
            </ResultList.Description>
          </ResultList.Content>
        </ResultList>
      </ReactiveList.ResultListWrapper>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <ReactiveBase app={elasticsearchIndex} url={elasticsearchServer}>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">
              IJF
            </a>
          </nav>

          <div className="row">
            <div className="col-8 col-lg-3 col-md-3 col-sm-4 scroll">
              <div className="box">
                <DataSearch
                  componentId="contributorReactor"
                  placeholder="Search"
                  dataField="contributor"
                  searchInputId="NameSearch"
                  iconPosition="right"
                />

                <MultiList
                  dataField="political_party.keyword"
                  title="Political Party Options"
                  componentId="politicalPartyReactor"
                  placeholder="Filter Political Party"
                  showFilter={true}
                  filterLabel="Political Party Options"
                  react={{
                    and: [
                      "contributorReactor",
                      "yearReactor",
                      "RangeSliderSensor",
                    ],
                  }}
                />

                <RangeSlider
                  componentId="RangeSliderSensor"
                  dataField="total_amount"
                  title="Total Amount"
                  range={{
                    start: 0,
                    end: 5000,
                  }}
                  rangeLabels={{
                    start: "Low",
                    end: "High",
                  }}
                  react={{
                    and: [
                      "contributorReactor",
                      "politicalPartyReactor",
                      "yearReactor",
                    ],
                  }}
                  renderError={(error) => (
                    <div>
                      Something went wrong with RangeSlider
                      <br />
                      Error details
                      <br />
                      {error}
                    </div>
                  )}
                />

                <MultiList
                  dataField="year"
                  title="Year Options"
                  componentId="yearReactor"
                  placeholder="Filter Year"
                  showFilter={true}
                  filterLabel="Year Options"
                  react={{
                    and: ["contributorReactor", "politicalPartyReactor"],
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-8 scroll">
              <ReactiveList
                componentId="queryResult"
                dataField="name"
                showResultStats={true}
                from={0}
                size={10}
                renderItem={this.onData}
                pagination={true}
                react={{
                  and: [
                    "politicalPartyReactor",
                    "contributorReactor",
                    "RangeSliderSensor",
                  ],
                }}
                renderError={(error) => (
                  <div>
                    Something went wrong with ResultList!
                    <br />
                    Error details
                    <br />
                    {error}
                  </div>
                )}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6" />
          </div>
        </ReactiveBase>
      </div>
    );
  }
}

export default App;
