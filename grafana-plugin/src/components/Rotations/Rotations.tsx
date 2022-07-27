import React, { Component, useMemo, useState } from 'react';

import { ValuePicker, IconButton, Icon, HorizontalGroup, Button } from '@grafana/ui';
import cn from 'classnames/bind';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import TimelineMarks from 'components/TimelineMarks/TimelineMarks';
import Rotation from 'containers/Rotation/Rotation';
import RotationForm from 'containers/RotationForm/RotationForm';
import { RotationCreateData } from 'containers/RotationForm/RotationForm.types';
import { Schedule } from 'models/schedule/schedule.types';
import { Timezone } from 'models/timezone/timezone.types';

import { getColor, getLabel, getRandomTimeslots, getRandomUser } from './Rotations.helpers';

import styles from './Rotations.module.css';

const cx = cn.bind(styles);

interface RotationsProps {
  startMoment: dayjs.Dayjs;
  currentTimezone: Timezone;
  scheduleId: Schedule['id'];
  onCreate: () => void;
  onUpdate: () => void;
}

type Layer = {
  id: string;
};

interface RotationsState {
  layerIdToCreateRotation?: Layer['id'];
}

class Rotations extends Component<RotationsProps, RotationsState> {
  state: RotationsState = {
    //layerIdToCreateRotation: '12',
  };

  render() {
    const { scheduleId, startMoment, currentTimezone, onCreate, onUpdate } = this.props;
    const { layerIdToCreateRotation } = this.state;

    const layers = [
      { id: 0, title: 'Layer 1' },
      /*{ id: 1, title: 'Layer 2' },
     { id: 2, title: 'Layer 3' },
      { id: 3, title: 'Layer 4' }*/
    ];

    const base = 7 * 24 * 60; // in minutes
    const diff = dayjs().tz(currentTimezone).diff(startMoment, 'minutes');

    const currentTimeX = diff / base;

    const rotations = [{} /* {}*/];

    return (
      <>
        <div className={cx('root')}>
          <div className={cx('header')}>
            <HorizontalGroup justify="space-between">
              <div className={cx('title')}>Rotations</div>
              <ValuePicker
                label="Add rotation"
                options={layers.map(({ title, id }) => ({
                  label: title,
                  value: id,
                }))}
                onChange={this.handleAddRotation}
                variant="secondary"
                size="md"
              />
            </HorizontalGroup>
          </div>
          <div className={cx('rotations-plus-title')}>
            {layers.map((layer, layerIndex) => (
              <div key={layerIndex}>
                <div className={cx('layer')}>
                  <div className={cx('layer-title')}>
                    <HorizontalGroup spacing="sm" justify="center">
                      Layer {layerIndex + 1} <Icon name="info-circle" />
                    </HorizontalGroup>
                  </div>
                  <div className={cx('header-plus-content')}>
                    <div className={cx('current-time')} style={{ left: `${currentTimeX * 100}%` }} />
                    <TimelineMarks debug startMoment={startMoment} />
                    <div className={cx('rotations')}>
                      {rotations.map((rotation, rotationIndex) => (
                        <Rotation
                          id={`${layerIndex}-${rotationIndex}`}
                          layerIndex={layerIndex}
                          rotationIndex={rotationIndex}
                          startMoment={startMoment}
                          currentTimezone={currentTimezone}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className={cx('add-rotations-layer')} onClick={this.handleAddLayer}>
              Add rotations layer +
            </div>
          </div>
        </div>
        {!isNaN(layerIdToCreateRotation) && (
          <RotationForm
            scheduleId={scheduleId}
            layerId={layerIdToCreateRotation}
            currentTimezone={currentTimezone}
            onHide={() => {
              this.setState({ layerIdToCreateRotation: undefined });
            }}
            onUpdate={onCreate}
            onCreate={onUpdate}
          />
        )}
      </>
    );
  }

  updateEvents = () => {};

  handleAddLayer = () => {};

  handleAddRotation = (option) => {
    this.setState({ layerIdToCreateRotation: option.value });
  };
}

export default Rotations;