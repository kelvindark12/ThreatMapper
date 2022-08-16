package main

import (
	"crypto/md5"
	"encoding/json"
	"fmt"

	"github.com/olivere/elastic/v7"
)

type CloudComplianceDoc struct {
	DocId               string `json:"doc_id"`
	Timestamp           string `json:"@timestamp"`
	Count               int    `json:"count,omitempty"`
	Reason              string `json:"reason"`
	Resource            string `json:"resource"`
	Status              string `json:"status"`
	Region              string `json:"region"`
	AccountID           string `json:"account_id"`
	Group               string `json:"group"`
	Service             string `json:"service"`
	Title               string `json:"title"`
	ComplianceCheckType string `json:"compliance_check_type"`
	CloudProvider       string `json:"cloud_provider"`
	NodeName            string `json:"node_name"`
	NodeID              string `json:"node_id"`
	ScanID              string `json:"scan_id"`
	Masked              string `json:"masked"`
	Type                string `json:"type"`
	ControlID           string `json:"control_id"`
	Description         string `json:"description"`
	Severity            string `json:"severity"`
}

func processCloudCompliance(compliance []byte, bulkp *elastic.BulkProcessor) {
	var doc CloudComplianceDoc
	err := json.Unmarshal(compliance, &doc)
	if err != nil {
		log.Errorf("error unmarshal cloud compliance scan result: %s", err)
		return
	}
	doc.Timestamp = getCurrentTime()
	docId := fmt.Sprintf("%x", md5.Sum([]byte(doc.ScanID+doc.ControlID+doc.Resource+doc.Group)))
	doc.DocId = docId

	bulkp.Add(elastic.NewBulkUpdateRequest().Index(cloudComplianceScanIndexName).
		Id(docId).Script(elastic.NewScriptStored("default_upsert").Param("event", doc)).
		Upsert(doc).ScriptedUpsert(true).RetryOnConflict(3))
}
