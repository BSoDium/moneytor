import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Grid, Input, Text } from '@nextui-org/react';
import { Project } from './ProjectSelector';
import Client from '../utils/Client';

const monthStart = new Date();
monthStart.setDate(1);

export default function Budget({
  monitoredProjects,
}: {
  monitoredProjects: Project[],
}) {
  const [hourlyRate, setHourlyRate] = useState(0);
  const [heartbeat, setHeartbeat] = useState(Date.now());
  const [timeRange, setTimeRange] = useState({
    start: monthStart,
    end: new Date(),
  })
  const [income, setIncome] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      let sum = 0;
      Promise.all(monitoredProjects.map((project) => Client.getProjectTime(
        project.name, 
        timeRange.start.toISOString().split('T')[0],
        timeRange.end.toISOString().split('T')[0],
        ))).then((summaries) => {
        summaries.forEach((summary) => {
          sum += summary.cummulative_total.decimal * hourlyRate;
        });
        setIncome(sum);
      });

      setHeartbeat(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, [hourlyRate, monitoredProjects, timeRange]);

  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12} md={6} lg={4}>
        <Card isHoverable css={{ p: "$6" }}>
          <Card.Body>
            <Text>Your income for the current month</Text>
            <Text h2>{income.toFixed(2)} €</Text>
            <Input
              type="number"
              placeholder="Hourly rate"
              aria-label='Hourly rate'
              bordered
              labelLeft="wage"
              labelRight="€/h"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
            />
          </Card.Body>
          <Card.Footer>
            <Badge variant="flat">
              Updated at {new Date(heartbeat).toLocaleTimeString()}
            </Badge>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container>
  );
}