import { Table, Input, Row, Col, Image } from "antd";

export default function DutySlipPreview({ dutySlip, setDutySlip, trip, expenses }) {

  const update = (field, value) => {
    setDutySlip(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div id="duty-slip" style={{ padding: 20, background: "#fff" }}>

      <h2 style={{ textAlign: "center", marginBottom: 20 }}>DUTY SLIP</h2>

      {/* TOP DETAILS */}
      <table className="dslip">
        <tbody>
          <tr>
            <td>Date</td>
            <td><Input value={dutySlip.date} onChange={e => update("date", e.target.value)} /></td>
            <td>Reg No</td>
            <td><Input value={dutySlip.regNo} onChange={e => update("regNo", e.target.value)} /></td>
            <td>RA No</td>
            <td><Input value={dutySlip.raNo} onChange={e => update("raNo", e.target.value)} /></td>
          </tr>

          <tr>
            <td>Guest Name</td>
            <td colSpan={3}>{trip.userName}</td>
            <td>Contact</td>
            <td>{trip.userPhone}</td>
          </tr>

          <tr>
            <td>Corporate Name</td>
            <td colSpan={3}>
              <Input value={dutySlip.corporateName} onChange={e => update("corporateName", e.target.value)} />
            </td>
            <td>Service City</td>
            <td>
              <Input value={dutySlip.serviceCity} onChange={e => update("serviceCity", e.target.value)} />
            </td>
          </tr>

          <tr>
            <td>Driver Name</td>
            <td>{trip.driverName}</td>
            <td>Contact</td>
            <td>{trip.driverPhone}</td>
            <td>Car</td>
            <td>{trip.driverCarType} - {trip.driverCarNumber}</td>
          </tr>

          <tr>
            <td>Pick-up Address</td>
            <td colSpan={5}>
              <Input value={dutySlip.pickupAddress} onChange={e => update("pickupAddress", e.target.value)} />
            </td>
          </tr>

          <tr>
            <td>Drop Address</td>
            <td colSpan={5}>
              <Input value={dutySlip.dropAddress} onChange={e => update("dropAddress", e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* TRIP LOG */}
      <h4 style={{ marginTop: 20 }}>Trip Log</h4>
      <table className="dslip">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Date / Time</th>
            <th>Kms</th>
            <th>Place</th>
          </tr>
        </thead>
        <tbody>
          {["Start", "Pickup", "Drop", "End"].map(stage => (
            <tr key={stage}>
              <td>{stage}</td>
              <td><Input /></td>
              <td><Input /></td>
              <td><Input /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EXPENSES */}
      <h4 style={{ marginTop: 20 }}>Expenses</h4>
      <table className="dslip">
        <tbody>
          {expenses.map(e => (
            <tr key={e.expenseId}>
              <td>{e.type}</td>
              <td colSpan={4}>{e.description}</td>
              <td>₹ {e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SIGNATURE */}
      <Row style={{ marginTop: 30 }}>
        <Col span={12}>
          <b>Customer Signature</b><br />
          {trip.signatureUrl && <Image width={200} src={trip.signatureUrl} />}
        </Col>
        <Col span={12}>
          <b>Driver Signature</b>
          <div style={{ height: 80, borderBottom: "1px solid #000" }} />
        </Col>
      </Row>

    </div>
  );
}
